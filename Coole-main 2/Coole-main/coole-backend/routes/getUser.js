const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/user");
const Leader = require("../models/leader");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.get("/getUser", authMiddleware, async (req, res) => {
  try {
    console.log("Decoded User from Middleware:", req.user);

    const userId = req.user?.userId;
    if (!userId) {
      return res.status(400).json({ error: "User ID missing from token" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.role === "Leader") {
      const leaderDetails = await Leader.findOne({ user: user._id });

      const responseData = {
        ...user.toObject(),
        leaderDetails: leaderDetails || null,
      };
      console.log("User Data:", responseData);
      res.status(200).json(responseData);
    }
    else {
      res.status(200).json(user);
    }
    

  } catch (error) {
    console.error("Get User Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
