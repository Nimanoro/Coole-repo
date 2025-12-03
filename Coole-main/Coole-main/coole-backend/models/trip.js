const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  program_name: { type: String, required: true },
  destination_city: { type: String, required: true },
  program_type: { type: String, enum: ["Public", "Private"], required: true },
  description: { type: String, required: true },
  images: [{ type: String }], // Array of Cloudinary image URLs
  steps: [ { title: String, description: String, day: String, date:String, image: String }], // Ensure structured steps
  schedule: {
    start_date: { type: String, required: true },
    end_date: { type: String, required: true },
    start_time: String,
    return_time: String,
    location: {
      address: String,
      coordinates: [{ type: Number }], // Latitude & Longitude
    },
  },
  activities: [{ type: String }], // Array of activity names
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  max_participants: { type: Number, min: 1, required: true }, // ✅ Define trip capacity
  services: {
    transportation: { type: String },
    insurance: { type: String },
    meals: {
      breakfast: { type: Number, default: 0 },
      lunch: { type: Number, default: 0 },
      dinner: { type: Number, default: 0 },
    },
  },
  cost_per_person: { type: Number, required: true },
  age_range: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
  },
  isApproved: { type: Boolean, default: false }, // Admin must approve
  facilities: [{ type: String }], // List of provided facilities
  createdAt: { type: Date, default: Date.now }, // Auto-generated timestamp
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Trip", tripSchema);
