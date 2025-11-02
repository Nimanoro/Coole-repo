const express = require("express");
const mongoose = require("mongoose");
const Trip = require("../models/trip"); // Assuming your Trip model is in `models/trip.js`
const User = require("../models/user");
const Leader = require("../models/leader");

const router = express.Router();

// 📌 GET a single trip by ID
router.get("/get-trip/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "❌ شناسه سفر نامعتبر است" });
    }

    // Find trip by ID
    const trip = await Trip.findById(id).lean();

    if (!trip) {
      return res.status(404).json({ error: "🚀 سفر مورد نظر یافت نشد" });
    }
    const leader = await Leader.findOne({ user: trip.createdBy }).lean();
    const user = await User.findById(trip.createdBy).lean();


    if (!leader) {
      return res.status(404).json({ error: "🚀 سفر مورد نظر یافت نشد" });
    }

    const tripWithLeader = { ...trip, leaderID: leader.user, leaderImage: leader.profileImage, leaderName: user.name };
    res.json(tripWithLeader);
  } catch (error) {
    console.error("Error fetching trip:", error);
    res.status(500).json({ error: "❌ خطای سرور" });
  }
});

module.exports = router;
