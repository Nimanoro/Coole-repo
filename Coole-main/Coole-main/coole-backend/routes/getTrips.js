const express = require("express");
const Trip = require("../models/trip");
const Leader = require("../models/leader");

const router = express.Router();

// 📌 GET all trips with optional filters (most viewed, nearest, etc.)
router.get("/get-trips", async (req, res) => {
  try {
    let { sortBy, limit, page, category } = req.query;
    limit = parseInt(limit) || 10;
    page = parseInt(page) || 1;
    const skip = (page - 1) * limit;
    
    let sortOption = {};
    if (sortBy === "mostViewed") sortOption = { views: -1 };
    else sortOption = { createdAt: -1 }; // Default: newest first
    
    // Fetch trips with optional filters
    let searchCriteria = {};
    if (category) {
      searchCriteria = { isApproved: true ,  activities: { $in: category} };
    }
    else {
      searchCriteria = { isApproved: true };
    }
    const trips = await Trip.find(searchCriteria)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean();
    console.log(trips); 
    let leader;
    // Fetch leader details for each trip
    let tripsWithLeader = [];

    for (let trip of trips) {
      leader = await Leader.findOne({ user: trip.createdBy }).lean();
      const tripWithLeader = { ...trip, leaderImage: leader.profileImage, leaderName: leader.name };
      tripsWithLeader.push(tripWithLeader);
        
    }
    
    res.json(tripsWithLeader);
  } catch (error) {
    console.error("Error fetching trips:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
