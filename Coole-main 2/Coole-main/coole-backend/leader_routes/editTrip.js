const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const upload = require("../middleware/uploadMiddleware");
const auth = require("../middleware/auth");
const Trip = require("../models/trip");
const authRole = require("../middleware/authRole");

const router = express.Router();

// ✅ Edit a Trip (Update Details + Handle Image Changes)
router.put(
  "/edit-trip/:tripId",
  auth,
  authRole("Leader"), // Ensure user is a leader
  upload.array("images", 5), // Accept multiple new images
  async (req, res) => {
    try {
      const { tripId } = req.params;
      const trip = await Trip.findById(tripId);

      if (!trip) return res.status(404).json({ error: "Trip not found" });

      // Ensure only the trip leader can edit
      if (trip.createdBy.toString() !== req.user.userId)
        return res.status(403).json({ error: "Access denied" });

      const { tripData, deletedImages } = req.body;

      // ✅ 1️⃣ Update trip text data (excluding images)
      const updatedTrip = JSON.parse(tripData);
      const parsedDeletedImages = deletedImages ? JSON.parse(deletedImages) : []; // Parse deleted images
      
      Object.keys(updatedTrip).forEach((key) => {
        trip[key] = updatedTrip[key];
      });

      // ✅ 2️⃣ Upload new images to Cloudinary
      if (req.files && req.files.length > 0) {
        const uploadedImages = await Promise.all(
          req.files.map(async (file) => {
            const result = await cloudinary.uploader.upload(file.path, {
              folder: "trip-images",
            });
            return result.secure_url;
          })
        );

        trip.images = [...trip.images, ...uploadedImages];
      }

      // ✅ 3️⃣ Delete removed images from Cloudinary & DB
      if (parsedDeletedImages && parsedDeletedImages .length > 0) {
        await Promise.all(
            parsedDeletedImages.map(async (deletedImage) => {
            const imageId = deletedImage.split("/").pop().split(".")[0]; // Extract Cloudinary public ID
            await cloudinary.uploader.destroy(imageId);
          })
        );

        trip.images = trip.images.filter(
          (img) => !parsedDeletedImages.includes(img)
        );
      }

      await trip.save();
      res.json({ message: "Trip updated successfully!", trip });
    } catch (error) {
      console.error("Error updating trip:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

module.exports = router;
