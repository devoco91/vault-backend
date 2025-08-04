// server.js

if (process.env.FLY_APP_NAME === undefined) {
  require('dotenv').config();
}

console.log('Starting server...');
console.log('MONGO_URI:', process.env.MONGO_URI ? 'defined' : 'undefined');
console.log('process.env.PORT:', process.env.PORT);

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const contactRoutes = require('./routes/contactRoutes');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Health check route (optional but recommended)
app.get('/healthz', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/', (req, res) => {
  res.send('Welcome to Vault Backend!');
});

app.use('/api/contact', contactRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
