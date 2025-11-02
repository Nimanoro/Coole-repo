const express = require("express");
const Trip = require("../models/trip");
const auth = require("../middleware/auth");
const authRole = require("../middleware/authRole");
const Leader = require("../models/leader");
const User = require("../models/user");

const router = express.Router();

// ✅ Get all pending trips (Fixed typo & optimized query)
router.get("/admin/pending-trips", auth, authRole("Admin"), async (req, res) => {
    try {
        const trips = await Trip.find({ isApproved: false }).lean();
        let response = trips.map((trip) => {
            return {
                ...trip,
                leaderImage: "",
                leaderName: "",
            };
        }
        );
        for (let trip of response) {
            const leader = await Leader.findOne({ user: trip.createdBy }).lean();
            const user = await User.findById(trip.createdBy).lean();
            trip.leaderImage = leader.profileImage;
            trip.leaderName = user.name
        }

        res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching trips:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// ✅ Approve a trip
router.post("/admin/approve-trip", auth, authRole("Admin"), async (req, res) => {
    const { tripId } = req.body;
    try {
        const trip = await Trip.findByIdAndUpdate(tripId, { isApproved: true }, { new: true });
        if (!trip) {
            return res.status(404).json({ error: "Trip not found" });
        }
        res.status(200).json({ success: true, message: "Trip approved successfully", trip });
    } catch (error) {
        console.error("Error approving trip:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// ❌ Reject a trip (Better query handling)
router.post("/admin/reject-trip", auth, authRole("Admin"), async (req, res) => {
    const { tripId } = req.body;
    try {
        const trip = await Trip.findById(tripId);
        if (!trip) {
            return res.status(404).json({ error: "Trip not found" });
        }
        await Trip.deleteOne({ _id: tripId }); // ✅ Updated to recommended method
        res.status(200).json({ success: true, message: "Trip rejected successfully" });
    } catch (error) {
        console.error("Error rejecting trip:", error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
