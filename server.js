const http = require('http');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const app = require('./app');
const { initSocket } = require('./sockets/socket');

// Load dotenv configuration
dotenv.config();

// Connect MongoDB
connectDB();

// Create HTTP server wrapping Express app
const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

// Define PORT
const PORT = process.env.PORT || 5000;

// Start Express / Socket.IO Server
server.listen(PORT, () => {
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
