const express = require("express");
const User = require("../models/user");
const authMiddleware = require("../middleware/auth");
const authRole = require("../middleware/authRole");

const router = express.Router();

// ✅ Update user interests
router.post("/users/interests", authMiddleware, authRole("User"), async (req, res) => {
    try {
        const { interests } = req.body;
        const userId = req.user?.userId;
        const user = await User.findById(userId);

        if (!user) { return res.status(404).json({ error: "User not found." }); }

        if (!Array.isArray(interests) || interests.length === 0) {
            return res.status(400).json({ error: "Invalid interests provided." });
        }

        user.preferences.preferredTripTypes = interests;
        await user.save();

        res.status(200).json({ message: "Interests updated successfully", interests: user.interests });

    } catch (error) {
        console.error("Update Interests Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
