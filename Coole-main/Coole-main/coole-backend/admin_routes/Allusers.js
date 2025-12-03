const express = require("express");
const authMiddleware = require("../middleware/auth");
const authRole = require("../middleware/authRole");
const User = require("../models/user");

const router = express.Router();

router.get("/admin/users", authMiddleware, authRole("Admin"), async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Admin User Fetch Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
