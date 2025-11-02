const express = require("express");
const Trip = require("../models/trip");

const router = express.Router();

router.get("/search-trips", async (req, res) => {
    try {
        const { query, type, activity, minPrice, maxPrice, startDate, endDate} = req.query;

        let searchCriteria = {};

        // 🔍 Search by Name or Destination
        if (query) {
            searchCriteria.$or = [
                { program_name: { $regex: query, $options: "i" } },
                { destination_city: { $regex: query, $options: "i" } },
            ];
        }

        // 🔍 Search by Trip Type
        if (type) {
            searchCriteria.program_type = type;
        }

        // 🔍 Search by Price Range
        if (minPrice || maxPrice) {
            searchCriteria.cost_per_person = {};
            if (minPrice) searchCriteria.cost_per_person.$gte = Number(minPrice);
            if (maxPrice) searchCriteria.cost_per_person.$lte = Number(maxPrice);
        }

        // 📅 Search by Date Range
        if (startDate || endDate) {
            searchCriteria["schedule.start_date"] = {};
            if (startDate) searchCriteria["schedule.start_date"].$gte = startDate;
            if (endDate) searchCriteria["schedule.start_date"].$lte = endDate;
        }

        // 🔍 Search by Activity (NEW FIX ✅)
        if (activity) {
            searchCriteria.activities = { $in: [activity] };
        }
        searchCriteria.isApproved = true; // Only approved trips

        // 🔍 Execute Query
        const trips = await Trip.find(searchCriteria);
        res.json(trips);
    } catch (error) {
        console.error("Error in trip search:", error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
