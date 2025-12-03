const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const sendVerificationEmail= require("../utils/validate");
const crypto = require("crypto");


const router = express.Router();

const generateVerificationCode = () => Math.floor(100000 + Math.random() * 900000).toString();

router.post("/resendVerification", async (req, res) => {
  try {
    const { email } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ error: "user does not exist!" });
    }

    const salt = await bcrypt.genSalt(10);
    const verificationCode = generateVerificationCode(); // Generate 6-digit code
    const hashedVerificationCode = await bcrypt.hash(verificationCode, salt); // Hash it before saving

    
    existingUser.verificationCode = hashedVerificationCode; // Remove the verification code
    existingUser.verificationCodeExpires = Date.now() + 10 * 60 * 1000; // Remove expiration
    existingUser.isVerified = false;
    await existingUser.save();
    sendVerificationEmail(email, verificationCode); // Modify to send code instead of link

    res.status(201).json({ message: "Signup successful! Please verify your email with the code sent." });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
