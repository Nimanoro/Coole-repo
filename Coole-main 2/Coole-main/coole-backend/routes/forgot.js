const express = require("express");
const crypto = require("crypto");
const User = require("../models/user");
const sendResetPassEmail = require("../utils/ResetPass");

const router = express.Router();

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ error: "User does not exist" });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");

    existingUser.resetPasswordToken = verificationToken;
    existingUser.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiry
    await existingUser.save();

    await sendResetPassEmail(email, verificationToken);

    res.status(200).json({ message: "Password reset email sent!" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
