const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  birthDate: { type: Date, required: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: "" }, // URL to profile picture
  role: { type: String, enum: ["User", "Leader", "Admin"], default: "User" }, // Role-based access
  travelHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Trip" }], // Array of Trip IDs
  location: {
    city: { type: String, default: "" },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
  },
  bookedTrips: [{ type: mongoose.Schema.Types.ObjectId, ref: "Trip" }], // Array of Trip IDs
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }], // Array of Transaction IDs
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Trip" }], // Array of Trip IDs
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date},
  preferences: {
    preferredLocations: [{ type: String }], // List of cities
    notificationSettings: {
      tripReminders: { type: Boolean, default: true },
      newTripAlerts: { type: Boolean, default: true },
    },
    preferredTripTypes: [{ type: String }], // Adventure, Nature, etc.
  },

  isVerified: { type: Boolean, default: false },
  verificationCode: { type: String },
  verificationCodeExpires: { type: Date },
  Transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],
  createdAt: { type: Date, default: Date.now }, // Auto-generated timestamp
});

module.exports = mongoose.model("User", UserSchema);
