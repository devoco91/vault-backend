exports.submitContactForm = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    console.log('Validation failed: Missing fields');
    return res.status(400).json({ error: 'Please fill all fields' });
  }

  try {
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    console.log('Contact form saved:', newContact);
    res.status(201).json({ message: 'Contact form submitted successfully' });
  } catch (error) {
    console.error('Contact form submission error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
