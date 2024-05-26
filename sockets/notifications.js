const User = require('../models/User');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected');

    // A set to keep track of sent notifications
    const sentNotifications = new Set();

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });

    // Emit notifications due in the next 5 minutes
    const checkNotifications = async () => {
      try {
        const users = await User.find({});
        const now = new Date();

        users.forEach(async (user) => {
          const notifications = user.user_notifications;
          if (notifications && notifications instanceof Map) {
            const upcomingNotifications = Array.from(
              notifications.values()
            ).filter((notification) => {
              const notificationTime = new Date(
                `${notification.date}T${notification.time}`
              );
              const timeDiff = (notificationTime - now) / 1000 / 60; // difference in minutes
              const notificationKey = `${user._id}-${notification.date}-${notification.time}`; // Unique key for each notification
              return (
                notification.status === 'Not taken' &&
                timeDiff <= 2 &&
                timeDiff >= 0 &&
                !sentNotifications.has(notificationKey)
              );
            });

            if (upcomingNotifications.length > 0) {
              socket.emit('notifications', upcomingNotifications);
              console.log('Notifications emitted:', upcomingNotifications); // Log emitted notifications

              // Add the notifications to the set of sent notifications
              upcomingNotifications.forEach((notification) => {
                const notificationKey = `${user._id}-${notification.date}-${notification.time}`;
                sentNotifications.add(notificationKey);
              });
            }
          }
        });
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    // Check for notifications every minute
    setInterval(checkNotifications, 60000);
  });
};
