const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to user
  messages: [
    {
      sender: String, // "user" or "support"
      text: String, // Message content
      time: String, // Timestamp
      image: String, // Image URL (if attached)
    },
  ],
  status: { type: String, enum: ["open", "pending", "resolved"], default: "open" }, // Ticket status
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Ticket", TicketSchema);