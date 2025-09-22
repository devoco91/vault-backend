const express = require("express");
const Contact = require("../models/Contact");
const router = express.Router();

/**
 * GET /api/contact
 * - Returns all saved contacts from DB
 * - If no contacts, returns empty array
 */
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json({
      message: "📋 Contacts fetched successfully",
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ error: "⚠️ Server error" });
  }
});

/**
 * POST /api/contact
 * - Validates and saves a new contact entry
 */
router.post("/", async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    country,
    companyName,
    projectDescription,
  } = req.body;

  // Basic validation
  if (!firstName || !lastName || !email || !country || !projectDescription) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Simple email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  try {
    const contact = new Contact({
      firstName,
      lastName,
      email,
      country,
      companyName,
      projectDescription,
    });

    await contact.save();

    res
      .status(200)
      .json({ message: "✅ Form submitted successfully and data saved!" });
  } catch (error) {
    console.error("Error in contact route:", error);
    res.status(500).json({ error: "⚠️ Server error" });
  }
});

module.exports = router;
