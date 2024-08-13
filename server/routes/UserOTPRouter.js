const express = require("express");
const router = express.Router();
const authController = require("../controllers/UserOTPController");

router.post("/request-otp", authController.requestOTP);
router.post("/verify-otp", authController.verifyOTP);

module.exports = router;
