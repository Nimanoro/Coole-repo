const express = require("express");
const cloudinary = require("../config/cloudinary");
const upload = require("../middleware/uploadMiddleware"); // ✅ Multer Middleware
const auth = require("../middleware/auth.js"); // ✅ Authentication Middleware
const User = require("../models/user");

const router = express.Router();

// 📌 Update Profile (Image + Description)
router.put(
  "/updateUserProfile",
  auth,
  upload.single("profileImage"), // ✅ Handling single file upload
  async (req, res) => {
    try {
      const { userId } = req.user; // Get authenticated user ID
      const { description } = req.body; // Extract description
      let updateFields = { description }; // Initialize update object

      // ✅ Find the user
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: "User not found" });

      // ✅ Handle Profile Image Update
      if (req.file) {
        // 📌 Delete Old Image from Cloudinary (if exists)
        if (user.profilePicture) {
          const publicId = user.profilePicture.split("/").pop().split(".")[0]; // Extract Cloudinary public ID
          await cloudinary.uploader.destroy(publicId);
        }

        // 📌 Upload New Image to Cloudinary
        const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
          folder: "profile-pictures",
        });

        updateFields.profileImage = uploadedImage.secure_url; // Update with new image URL
      }
      user.profilePicture = updateFields.profileImage;
      await user.save();


      res.status(200).json({
        message: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ error: "Server Error" });
    }
  }
);

module.exports = router;
