const express = require("express");
const User = require("../models/user");
const router = express.Router();

router.get("/reset-password/:token", async (req, res) => {
    try {
        const { token } = req.params;

        // ✅ Find user with reset token & check expiry
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() } // Ensure token is not expired
        });

        if (!user) {
            return res.status(400).json({ error: "Invalid or expired password reset link." });
        }

        res.status(200).json({ resetUrl: `${process.env.FRONTEND_URL}/reset-password/${token}` });

    } catch (error) {
        console.error("Password Reset Token Validation Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
