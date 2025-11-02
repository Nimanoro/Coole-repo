const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const upload = require("../middleware/uploadMiddleware");
const auth = require("../middleware/auth");
const Trip = require("../models/trip");

const router = express.Router();

router.post(
  "/trips",
  auth,
  upload.fields([
    { name: "images", maxCount: 10 },       // ✅ Main trip images
    { name: "stepsImages", maxCount: 10 }, // ✅ Step images (one per step)
  ]),
  async (req, res) => {
    try {
      const { userId } = req.user;
      if (!req.files) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      // ✅ Upload main trip images to Cloudinary
      const uploadedImages = await Promise.all(
        (req.files["images"] || []).map(async (file) => {
          const result = await cloudinary.uploader.upload(file.path, { folder: "trip-images" });
          return result.secure_url;
        })
      );

      // ✅ Upload step images to Cloudinary
      const stepImages = req.files["stepsImages"] || [];
      const stepsData = JSON.parse(req.body.stepsData || "[]");

      // ✅ Assign uploaded step images correctly
      const stepsWithImages = await Promise.all(
        stepsData.map(async (step, index) => ({
          ...step,
          image: stepImages[index]
            ? (await cloudinary.uploader.upload(stepImages[index].path, { folder: "trip-steps" })).secure_url
            : null,
        }))
      );

      // ✅ Save trip with correct step-image mappings
      const newTrip = new Trip({
        ...JSON.parse(req.body.tripData), // Parse trip data
        images: uploadedImages,          // Store main trip images
        steps: stepsWithImages,          // Store steps with assigned images
        createdBy: userId,
      });

      await newTrip.save();
      res.status(201).json({ message: "Trip created successfully!", trip: newTrip });
    } catch (error) {
      console.error("Error creating trip:", error);
      res.status(500).json({ error: "Server Error" });
    }
  }
);

module.exports = router;
