const mongoose = require('mongoose');
require('dotenv').config();

const runDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
      },
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.log('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

module.exports = { runDB };
