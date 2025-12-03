const express = require("express");
const cloudinary = require("../config/cloudinary");
const upload = require("../middleware/uploadMiddleware");  // ✅ Import correctly
const auth= require("../middleware/auth.js");
const User = require("../models/user");
const TourLeader = require("../models/leader");

const router = express.Router();

router.post(
  "/leader-register",
  auth, 
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "nationalID", maxCount: 1 },
    { name: "insuranceFile", maxCount: 1 },
    { name: "workPermit", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { userId } = req.user;

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: "User not found" });
      if (user.role !== "Leader") return res.status(403).json({ error: "Not a tour leader" });

      const existingLeader = await TourLeader.findOne({ user: userId });
      if (!existingLeader) return res.status(400).json({ error: "Already not registered as a Leader" });

      if (!req.files) {
        return res.status(400).json({ error: "No files uploaded." });
      }

      // ✅ Upload files to Cloudinary
      const fileKeys = ["profileImage", "nationalID", "insuranceFile", "workPermit"];
      const fileUrls = {};

      for (const key of fileKeys) {
        if (req.files[key]) {
          const uploadedFile = await cloudinary.uploader.upload(req.files[key][0].path, {
            folder: "tour-leaders-docs",
          });
          fileUrls[key] = uploadedFile.secure_url;
        }
      }

      existingLeader.profileImage = fileUrls.profileImage;
      existingLeader.nationalID = fileUrls.nationalID;
      existingLeader.insuranceFile = fileUrls.insuranceFile;
      existingLeader.workPermit = fileUrls.workPermit;
      existingLeader.isApproved = false; // Requires admin approval
      existingLeader.submited = true; // ✅ Fixed typo: `submitted` instead of `submited`

      await existingLeader.save();

      res.status(201).json({ message: "Tour Leader Registered! Pending Admin Approval." });
    } catch (error) {
      console.error("Registration Error:", error);
      res.status(500).json({ error: "Server Error" });
    }
  }
);

module.exports = router;
