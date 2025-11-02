// routes/api/user.js (or wherever your routes live)

const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Trip = require("../models/trip");
const auth = require("../middleware/auth"); // your JWT auth middleware

router.post("/swipe/favorite", auth, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { tripId } = req.body;

    if (!tripId) return res.status(400).json({ error: "tripId is required" });

    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ error: "Trip not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.favorites.includes(tripId)) {
      user.favorites.push(tripId);
      await user.save();
    }

    res.status(200).json({ message: "Trip added to favorites" });
  } catch (err) {
    console.error("Swipe error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/favorites", auth, async (req, res) => {
  try {
    const userId = req.user?.userId;

    const user = await User.findById(userId).populate("favorites");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user.favorites);
  } catch (err) {
    console.error("Error fetching favorites:", err);
    res.status(500).json({ error: "Server error" });
  }
}
);

module.exports = router;