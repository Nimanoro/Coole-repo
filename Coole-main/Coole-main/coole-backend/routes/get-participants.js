const express = require("express");
const User = require("../models/user");
const authMiddleware = require("../middleware/auth");
const authRole = require("../middleware/authRole");
const Trip = require("../models/trip");


const router = express.Router();


router.get("/get-participants/:id", authMiddleware, async (req, res) => {
    try {
        
        const { id } = req.params; 
        const trip = await Trip.findById(id);

        if (!trip) {
            console.log("Trip not found");
            return res.status(404).json({ error: "Trip not found" });
        }

        const participants = await Promise.all(
            trip.participants.map(async (participantId) => {
                const participant = await User.findById(participantId).lean();
                if (!participant) return null;
                return {
                    name: participant.name,
                    profileImage: participant.profilePicture,
                };
            })
        );
        res.json(participants);
    } catch (error) {
        console.error("Error fetching participants:", error);
        res.status(500).json({ error: "Server error" });
    }
}
);
module.exports = router;