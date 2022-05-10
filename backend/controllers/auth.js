const OtpService = require("../services/opt-service")
const tokenService = require("../services/token-service")
const UserService = require("../services/user-service")
const UserDtos = require("../dtos/user-dtos")

class AuthController {
  async sendotp(req, res) {
    const { phone } = req.body

    if (!phone) {
      return res.status(400).send({
        message: "Phone number is required",
      })
    }

    //? Generating OTP and hashing with phone number
    const otp = await OtpService.generateOtp()
    //const otp = 123
    const ttl = 1000 * 60 * 2 // 2 minutes
    const expires = Date.now() + ttl
    const data = `${phone}.${otp}.${expires}`
    const hash = OtpService.hashOtp(data)

    //? Send Otp
    try {
      //await OtpService.sendOtpSms(phone, otp)
      return res.json({
        hash: `${hash}.${expires}`,
        phone,
        otp,
      })
    } catch (err) {
      return res.status(500).send({
        message: "Sending otp failed",
        error: err,
      })
    }
  }

  async verifyotp(req, res) {
    const { phone, hash, otp } = req.body

    if (!hash || !otp || !phone) {
      return res.status(400).send({
        message: "Otp, phone and hash are required",
      })
    }

    const [otpHash, expires] = hash.split(".")
    const current = Date.now()

    if (current > +expires) {
      return res.status(400).send({
        message: "Otp has expired",
      })
    }

    if (OtpService.hashOtp(`${phone}.${otp}.${expires}`) !== otpHash) {
      return res.status(400).send({
        message: "Otp is invalid",
      })
    }

    let user

    try {
      user = await UserService.findUser({ phone })
      if (!user) await UserService.createUser({ phone })
      //!token
      const { accessToken, refreshToken } = tokenService.generateToken({
        _id: user._id,
        activated: false,
      })

      await tokenService.storeRefreshToken(refreshToken, user._id)

      res.cookie("accessToken", accessToken, {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })

      res.cookie("refreshToken", refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })

      res.status(200).json({
        accessToken,
        user: new UserDtos(user),
      })
    } catch (err) {
      console.log(err)
      return res.status(500).send({
        error: err,
        message: "User creation failed",
      })
    }
  }

  async refresh(req, res) {
    const refreshTokenFromCookie = req.cookies.refreshToken
    let userData

    //? Check if refresh token is valid
    try {
      userData = tokenService.verifyRefreshToken(refreshTokenFromCookie)
    } catch (err) {
      return res.status(401).send({
        message: "Refresh token is invalid",
      })
    }
    //? Check if refresh token is expired
    try {
      const token = await tokenService.findRefreshToken(
        userData._id,
        refreshTokenFromCookie
      )

      if (!token) {
        return res.status(401).send({
          message: "Refresh token expired or not present",
        })
      }
    } catch (err) {
      return res.status(500).send({
        message: "Internal Server Error",
      })
    }

    //? Generate new access token
    const user = await UserService.findUser({ _id: userData._id })

    if (!user) {
      return res.status(401).send({
        message: "No User",
      })
    }

    const { refreshToken, accessToken } = await tokenService.generateToken({
      _id: userData._id,
    })

    //? Update refresh token
    try {
      await tokenService.updateRefreshToken(userData._id, refreshToken)
    } catch (err) {
      return res.status(500).send({
        message: "Internal Server Error",
      })
    }

    //? Set cookies
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
    })

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
    })

    res.status(200).json({
      accessToken,
      user: new UserDtos(user),
    })
  }

  async logout(req, res) {
    //delete refresh token
    await tokenService.deleteRefreshToken(req.cookies.refreshToken)
    res.clearCookie("accessToken")
    res.clearCookie("refreshToken")
    res.status(200).json({
      user: null,
      auth: false,
      message: "Logged out successfully",
    })
  }
}

module.exports = new AuthController()
