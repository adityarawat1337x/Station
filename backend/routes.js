const router = require("express").Router()
const AuthController = require("./controllers/auth")

router.post("/api/send-otp", AuthController.sendotp)
router.post("/api/verify-otp", AuthController.verifyotp)

module.exports = router
