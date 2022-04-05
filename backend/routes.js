const router = require("express").Router()
const ActivateController = require("./controllers/activate")
const AuthController = require("./controllers/auth")
const authMiddleware = require("./middlewares/auth-middleware")

router.post("/api/send-otp", AuthController.sendotp)
router.post("/api/verify-otp", AuthController.verifyotp)
router.post("/api/activate", authMiddleware, ActivateController.activate)
router.get("/api/refresh", AuthController.refresh)
router.post("/api/logout", authMiddleware, AuthController.logout)
module.exports = router
