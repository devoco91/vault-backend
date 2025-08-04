const mongoose = require('mongoose');

console.log('🌍 Full process.env:', JSON.stringify(process.env, null, 2));
console.log('📦 MONGO_URI from env:', process.env.MONGO_URI);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Mongoose connection events
mongoose.connection.on('connected', () => {
  console.log('📡 Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
  console.error(`❌ Mongoose connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Mongoose disconnected');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🔌 Mongoose connection closed due to app termination');
  process.exit(0);
});

module.exports = connectDB;
