const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  country: { type: String, required: true },
  companyName: { type: String, required: true },
  projectDescription: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Contact", contactSchema);
