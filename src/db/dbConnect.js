const mongoose = require('mongoose');
const Config = require('../configs/Config.js');

const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => {
      console.log('✅ Connected to MongoDB');
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ Disconnected from MongoDB');
    });

    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB Connection Error:', error);
    });

    await mongoose.connect(Config.DB_URI);
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    throw error;
  }
};

module.exports = connectDB;
