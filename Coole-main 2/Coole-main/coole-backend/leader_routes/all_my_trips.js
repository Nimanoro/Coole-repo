const express = require("express");
const Trip = require("../models/trip");
const auth = require("../middleware/auth");
const authRole = require("../middleware/authRole");

const router = express.Router();

// 📌 GET all trips with optional filters (most viewed, nearest, etc.)
router.get("/get-leader-trips", auth, authRole("Leader"), async (req, res) => {
    try {
        const { userId } = req.user;
        const trips = await Trip.find({ createdBy: userId }).lean();
    
        res.json(trips);
    } catch (error) {
        console.error("Error fetching trips:", error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
