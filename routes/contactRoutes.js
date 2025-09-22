const express = require("express");
const Contact = require("../models/Contact");
const router = express.Router();

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
    // Save contact info to DB
    const contact = new Contact({
      firstName,
      lastName,
      email,
      country,
      companyName,
      projectDescription,
    });

    await contact.save();

    res.status(200).json({ message: "✅ Form submitted successfully and data saved!" });
  } catch (error) {
    console.error("Error in contact route:", error);
    res.status(500).json({ error: "⚠️ Server error" });
  }
});

module.exports = router;
