const mongoose = require("mongoose");
const trip = require("./trip");

const TransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip"},
  amount: { type: Number, required: true },
  type: { type: String, enum: ["Deposit", "Withdrawal"], required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("TourLeader", TourLeaderSchema);
