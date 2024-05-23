const socketIo = require('socket.io');
const User = require('../models/User');

module.exports = (server) => {
  const io = socketIo(server);

  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;

    // Join a room specific to the user
    socket.join(userId);

    // Function to send notifications to the user
    const sendNotification = async () => {
      const user = await User.findById(userId);
      if (user) {
        const notifications = Array.from(user.user_notifications.values());
        socket.emit('notification', notifications);
      }
    };

    sendNotification();

    socket.on('disconnect', () => {
      socket.leave(userId);
    });
  });
};
