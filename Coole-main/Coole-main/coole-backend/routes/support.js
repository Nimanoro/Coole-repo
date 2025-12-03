const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket");
const auth = require("../middleware/auth");
const multer = require("multer");
const authRole = require("../middleware/authRole");
const cloudinary = require("../config/cloudinary");

// Multer config for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * 📌 1️⃣ Create a new support ticket
 */
router.post("/support/create", auth, upload.single("image"), async (req, res) => {
  try {
    const { text } = req.body;
    const { userId } = req.user
    // Upload image if provided
    let imageUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.buffer.toString("base64"));
      imageUrl = result.secure_url;
    }

    const ticket = new Ticket({
      user_id: userId,
      messages: [{ sender: "user", text, time: new Date().toISOString(), image: imageUrl }],
    });

    await ticket.save();
    res.status(201).json({ message: "تیکت با موفقیت ایجاد شد", ticket });
  } catch (error) {
    console.error("خطای ایجاد تیکت:", error);
    res.status(500).json({ error: "خطای سرور" });
  }
});

/**
 * 📌 2️⃣ Fetch all tickets for a user
 */
router.get("/support/tickets", auth, async (req, res) => {
  const { userId } = req.user

  try {
    const tickets = await Ticket.find({ user_id: userId}).sort({ created_at: -1 });
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ error: "خطای سرور" });
  }
});

/**
 * 📌 3️⃣ Fetch a specific ticket’s messages
 */
router.get("/support/ticket/:ticket_id", auth, async (req, res) => {
  try {
    const{ticket_id} = req.params
    const ticket = await Ticket.findById({_id: ticket_id  });
    if (!ticket) return res.status(404).json({ error: "تیکت پیدا نشد" });
    res.status(200).json(ticket);
  } catch (error) {
    console.error("خطای دریافت تیکت:", error);
    res.status(500).json({ error: "خطای سرور" });
  }
});

/**
 * 📌 4️⃣ Admin replies to a support ticket
 */
router.post("/admin/ticket/reply", auth, authRole("Admin"), upload.single("image"), async (req, res) => {
  try {
    const ticket_id = req.body.ticket_id;
    const text = req.body.text;
    console.log("Extracted ticket_id:", ticket_id);
    // Upload image if provided
    let imageUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.buffer.toString("base64"));
      imageUrl = result.secure_url;
    }

    const ticket = await Ticket.findById(String(ticket_id));
    if (!ticket) return res.status(404).json({ error: "تیکت پیدا نشد" });
    ticket.messages.push({
      sender: "admin",
      text,
      time: new Date().toISOString(),
      image: imageUrl,
    });

    await ticket.save();
    res.status(200).json(ticket);
  } catch (error) {
    console.error("خطای ارسال پیام:", error);
    res.status(500).json({ error: "خطای سرور" });
  }
});

router.get("/admin/tickets", auth, authRole("Admin"), async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ created_at: -1 });
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ error: "خطای سرور" });
  }
}
);

/**
 * 📌 5️⃣ Update ticket status (User/Admin)
 */
router.patch("/admin/ticket/status", auth, authRole("Admin"), async (req, res) => {
  try {
    const { ticket_id, status } = req.body;
    const ticket = await Ticket.findById(ticket_id);
    

    if (!ticket) return res.status(404).json({ error: "تیکت پیدا نشد" });
    ticket.status = status;
    await ticket.save();
    res.status(200).json(ticket);
  } catch (error) {
    console.error("خطای بروزرسانی وضعیت تیکت:", error);
    res.status(500).json({ error: "خطای سرور" });
  }
});

router.post("/support/ticket/reply", auth, upload.single("file"), async (req, res) => {
  try {
    const ticket_id = req.body.ticket_id;
    const text = req.body.text;
    console.log("Extracted ticket_id:", ticket_id);

    


    // Upload image if provided
    let imageUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.buffer.toString("base64"));
      imageUrl = result.secure_url;
    }

    const ticket = await Ticket.findById(String(ticket_id));
    if (!ticket) return res.status(404).json({ error: "تیکت پیدا نشد" });
    ticket.messages.push({
      sender: "user",
      text,
      time: new Date().toISOString(),
      image: imageUrl,
    });

    await ticket.save();
    res.status(200).json(ticket);
  } catch (error) {
    console.error("خطای ارسال پیام:", error);
    res.status(500).json({ error: "خطای سرور" });
  }
});

module.exports = router;
