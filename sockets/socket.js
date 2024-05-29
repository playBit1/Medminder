const socketIO = require('socket.io');

//initialize
const initializeSocket = (server) => {
  const io = socketIO(server);
  return io;
};

module.exports = initializeSocket;
