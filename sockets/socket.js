const socketIO = require('socket.io');

//initialize
const initializeSocket = (server) => {
  const io = socketIO(server);

  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

  return io;
};

module.exports = initializeSocket;
