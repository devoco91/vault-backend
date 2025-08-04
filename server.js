// server.js

if (process.env.FLY_APP_NAME === undefined) {
  require('dotenv').config(); // ✅ Load .env locally only
}

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const contactRoutes = require('./routes/contactRoutes');

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to Vault Backend!');
});

app.use('/api/contact', contactRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('❌ MONGO_URI is not defined. Check .env or Fly secrets.');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
