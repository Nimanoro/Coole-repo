const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Leader = require("../models/leader");
const sendVerificationEmail= require("../utils/validate");
const crypto = require("crypto");


const router = express.Router();

const generateVerificationCode = () => Math.floor(100000 + Math.random() * 900000).toString();

router.post("/signup", async (req, res) => {
  try {
    const { name, email, phone, password, birthDate, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationCode = generateVerificationCode(); // Generate 6-digit code
    const hashedVerificationCode = await bcrypt.hash(verificationCode, salt); // Hash it before saving

    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      birthDate,
      verificationCode: hashedVerificationCode, // Store hashed code for security
      verificationCodeExpires: Date.now() + 10 * 60 * 1000, // Code expires in 10 minutes
      role,
      isVerified: false, // New field to track verification status
    });

    await newUser.save();
    sendVerificationEmail(email, verificationCode); // Modify to send code instead of link
    if (role === "Leader") {
      // Add leader-specific data
      const newLeader = new Leader({ user: newUser._id });
      await newLeader.save();
    }
    res.status(201).json({ message: "Signup successful! Please verify your email with the code sent." });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;
