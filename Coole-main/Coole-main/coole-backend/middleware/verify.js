const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.post("/verify", async (req, res) => {
    try {
        const { email, code } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        if (!user.verificationCode || !user.verificationCodeExpires) {
            return res.status(400).json({ error: "No verification code found or it has already been used" });
        }

        if (Date.now() > user.verificationCodeExpires) {
            return res.status(400).json({ error: "Verification code expired. Please request a new one." });
        }

        const isMatch = await bcrypt.compare(code, user.verificationCode);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid verification code" });
        }

        // Mark user as verified
        user.isVerified = true;
        user.verificationCode = undefined; // Remove the verification code
        user.verificationCodeExpires = undefined; // Remove expiration
        await user.save();
        const token = jwt.sign({ userId: user._id , userRole: user.role}, process.env.JWT_SECRET, {
              expiresIn: "7d",
            });

        res.cookie("token", token, {
            httpOnly: true,
            secure: true, // ✅ Required for HTTPS
            sameSite: "None", // ✅ Allows cross-origin cookies
            maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
          });
          
        res.status(200).json({ message: "Email verified successfully." });

    } catch (error) {
        console.error("Email Verification Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;