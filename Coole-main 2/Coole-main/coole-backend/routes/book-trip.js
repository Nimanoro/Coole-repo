const express = require("express");
const router = express.Router();
const Trip = require("../models/trip");
const User = require("../models/user");
const authMiddleware = require("../middleware/auth");
const Leader = require("../models/leader");

router.post("/book-trip/:id", authMiddleware, async (req, res) => {
    try {
        const tripId = req.params.id;
        const userId = req.user?.userId;
        
        const trip = await Trip.findById(tripId);
        if (!trip) {
            return res.status(404).json({ error: "Trip not found" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (!user.bookedTrips) {
            user.bookedTrips = [];
            await user.save();

        }

        // ✅ Check if the user already booked this trip
        if (user.bookedTrips.includes(tripId)) {
            return res.status(400).json({ error: "Trip already booked" });
        }
        const leader = await Leader.findOne({ user: trip.createdBy });
        if (!leader.balance) {
            leader.balance = 0;
        }
        // ✅ Update leader's balance
        leader.balance = leader.balance + trip.cost_per_person;
        await leader.save();
        

        // ✅ Add trip to user's booked trips
        user.bookedTrips.push(tripId);
        await user.save();

        // ✅ Add user to trip's participants & save
        trip.participants.push(userId);
        await trip.save();

       

        res.status(200).json({ message: "✅ Trip booked successfully!" });
    } catch (error) {
        console.error("Book Trip Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
