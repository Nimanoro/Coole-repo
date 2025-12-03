const express = require("express");
const authMiddleware = require("../middleware/auth");
const authRole = require("../middleware/authRole");
const User = require("../models/user");
const Leader = require("../models/leader");

const router = express.Router();

router.get("/admin/pending-leaders", authMiddleware, authRole("Admin"), async (req, res) => {
  try {
    const leaders = await Leader.find({ isApproved: false, submited: true}).populate("user");
    res.status(200).json(leaders);
  } catch (error) {
    console.error("Admin User Fetch Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/admin/approve-leader/:id", authMiddleware, authRole("Admin"), async (req, res) => {
  try {
    const leader = await Leader.findById(req.params.id);
    if (!leader) return res.status(404).json({ error: "Leader not found" });

    leader.isApproved = true;
    await leader.save();

    res.status(200).json({ message: "Leader approved successfully!" });
  } catch (error) {
    console.error("Approval Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

router.post("/admin/reject-leader/:id", authMiddleware, authRole("Admin"), async (req, res) => {
  try {
    const leader = await Leader.findById(req.params.id);
    if (!leader) return res.status(404).json({ error: "Leader not found" });

    await Leader.findByIdAndDelete(req.params.id); // ❌ Delete Leader Request

    res.status(200).json({ message: "Leader rejected and removed." });
  } catch (error) {
    console.error("Rejection Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
})



module.exports = router;
