const jwt = require("jsonwebtoken")
class TokenService {
  generateToken(payload) {
    let accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    })
    let refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    })
    return { accessToken, refreshToken }
  }
  verifyToken(token) {}
}

module.exports = new TokenService()
