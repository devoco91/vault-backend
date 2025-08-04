const express = require("express");
const Contact = require("../models/Contact");
const router = express.Router();

let fetch;
async function loadFetch() {
  fetch = (await import("node-fetch")).default;
}
loadFetch();

router.post("/", async (req, res) => {
  if (!fetch) {
    return res.status(503).json({ error: "Server is not ready" });
  }

  const {
    firstName,
    lastName,
    email,
    country,
    companyName,
    projectDescription,
    recaptchaToken,
  } = req.body;

  if (!recaptchaToken) {
    return res.status(400).json({ error: "No reCAPTCHA token provided" });
  }

  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    // Prepare form data for verification
    const params = new URLSearchParams();
    params.append("secret", secretKey);
    params.append("response", recaptchaToken);

    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const googleResponse = await response.json();

    if (!googleResponse.success) {
      return res.status(400).json({ error: "reCAPTCHA verification failed", details: googleResponse["error-codes"] });
    }

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

    res.status(200).json({ message: "Form submitted successfully and data saved!" });
  } catch (error) {
    console.error("Error in contact route:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
