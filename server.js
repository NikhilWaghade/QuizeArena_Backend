const dotenv = require('dotenv');
const connectDB = require('./config/db');
const app = require('./app');

// Load dotenv configuration
dotenv.config();

// Connect MongoDB
connectDB();

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
