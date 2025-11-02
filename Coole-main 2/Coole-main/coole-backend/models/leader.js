const { Transaction } = require("mongodb");
const mongoose = require("mongoose");

const TourLeaderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  profileImage: { type: String, required: false }, 
  nationalID: { type: String, required: false },
  insuranceFile: { type: String, required: false },
  workPermit: { type: String, required: false },
  isApproved: { type: Boolean, default: false }, // Admin must approve
  submited: { type: Boolean, default: false }, // Leader has submitted docs
  createdAt: { type: Date, default: Date.now },
  balance: { type: Number, default: 0 },
});

module.exports = mongoose.model("TourLeader", TourLeaderSchema);
