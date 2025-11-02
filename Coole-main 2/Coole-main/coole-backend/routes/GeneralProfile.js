const express = require("express");
const User = require("../models/user");
const Leader = require("../models/leader");

const router = express.Router();

router.get("/general-profile/:id", async (req, res) => {
  try {

    const { id } = req.params;
    const userId = id;
    if (!userId) {
      return res.status(400).json({ error: "User ID missing from token" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const responseData = {
        name: user.name,
        profilePicture: user.profilePicture,
        travelHistory: user.travelHistory || [],
        bookedTrip: user.bookedTrip || [],
        favorites: user.favorites || [],
        preferredTripTypes: user.preferences?.preferredTripTypes || [],
      };

      res.status(200).json(responseData);
    

  } catch (error) {
    console.error("Get User Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
