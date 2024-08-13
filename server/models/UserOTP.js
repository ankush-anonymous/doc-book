const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // Set the expiration time in seconds (e.g., 300 seconds = 5 minutes)
  },
});

const OTP = mongoose.model("OTP", otpSchema);

module.exports = OTP;
