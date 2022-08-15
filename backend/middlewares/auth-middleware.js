const TokenService = require("../services/token-service")

module.exports = async (req, res, next) => {
  try {
    const { accessToken } = req.cookies
    if (!accessToken) {
      throw new Error()
    }

    const userData = TokenService.verifyAccessToken(accessToken)

    if (!userData) {
      throw new Error()
    }
    req.user = userData
    next()
  } catch (Error) {
    res.status(401).send({
      message: "Invalid access token",
      error: Error,
    })
  }
}
