const jwt = require("jsonwebtoken")
const refreshModel = require("../models/refresh-model")
class TokenService {
  generateToken(payload) {
    let accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1m",
    })
    let refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    })
    return { accessToken, refreshToken }
  }

  async storeRefreshToken(token, userId) {
    try {
      await Refresh.create({ token, userId })
    } catch (err) {
      throw err
    }
  }

  async verifyAccessToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET)
  }

  async verifyRefreshToken(token) {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET)
  }

  async findRefreshToken(userId, refreshToken) {
    return await refreshModel.findOne({
      _id: userId,
      token: refreshToken,
    })
  }

  async updateRefreshToken(userId, refreshToken) {
    return await refreshModel.updateOne(
      { user_id: userId },
      { $set: { token: refreshToken } }
    )
  }
}

module.exports = new TokenService()
