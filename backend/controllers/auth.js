const OtpService = require("../services/opt-service")
const tokenService = require("../services/token-service")
const UserService = require("../services/user-service")

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
    const ttl = 1000 * 60 * 2 // 2 minutes
    const expires = Date.now() + ttl
    const data = `${phone}.${otp}.${expires}`
    const hash = await OtpService.hashOtp(data)

    //? Send Otp
    try {
      await OtpService.sendOtpSms(phone, otp)
      return res.json({
        hash: `${hash}.${expires}`,
        phone,
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

    if ((await OtpService.hashOtp(`${phone}.${otp}.${expires}`)) !== otpHash) {
      return res.status(400).send({
        message: "Otp is invalid",
      })
    }

    let user

    try {
      user = await UserService.findUser({ phone })
      if (!user) await UserService.createUser({ phone })
    } catch (err) {
      return res.status(500).send({
        message: "User creation failed",
      })
    }

    //!token

    const { accessToken, refreshToken } = tokenService.generateToken({
      id: user._id,
      activated: false,
    })

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
    })

    res.status(200).json({
      accessToken,
    })
  }
}

module.exports = new AuthController()
