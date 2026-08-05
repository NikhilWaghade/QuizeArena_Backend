const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load dotenv configuration
dotenv.config();

// Connect MongoDB
connectDB();

// Initialize Express App
const app = express();

// Parse JSON and urlencoded requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define PORT
const PORT = process.env.PORT || 5000;

// Start Express Server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle server startup/runtime errors
server.on('error', (error) => {
  console.error(`Express Server Error: ${error.message}`);
  process.exit(1);
});

// Handle unhandled promise rejections globally
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Promise Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});
