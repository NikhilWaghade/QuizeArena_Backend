const { Server } = require('socket.io');

let io;

/**
 * Initialize Socket.IO instance and register core lifecycle event handlers.
 * @param {object} server - HTTP Server instance
 */
const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*', // Allow all origins for development
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('Socket Connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('Socket Disconnected:', socket.id);
    });
  });

  return io;
};

/**
 * Retrieve the initialized Socket.IO server instance.
 */
const getIO = () => {
  if (!io) {
    throw new Error('Socket.io has not been initialized!');
  }
  return io;
};

module.exports = {
  initSocket,
  getIO
};
