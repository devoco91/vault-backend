const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const contactRoutes = require('./routes/contactRoutes');
const cors = require('cors');  // Add this

dotenv.config();
connectDB();

const app = express();

app.use(cors());           // Enable CORS for all origins
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to Vault Backend!');
});

// Contact form routes
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
