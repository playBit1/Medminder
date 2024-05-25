const User = require('../models/User');

// Fetch all notifications for a user
const getNotifications = async (req, res, next) => {
  const userId = req.user._id; // Assuming userId is set in req by auth middleware
  try {
    const user = await User.findById(userId);
    if (user) {
      if (user.user_notifications) {
        let notifications;
        if (user.user_notifications instanceof Map) {
          notifications = Array.from(user.user_notifications.values());
        } else if (Array.isArray(user.user_notifications)) {
          notifications = user.user_notifications;
        } else if (typeof user.user_notifications === 'object') {
          notifications = Object.values(user.user_notifications);
        } else {
          throw new Error('user_notifications is not a recognized iterable type');
        }

        res.json({ notifications });
      } else {
        res.status(404).json({ message: 'No notifications found for the user' });
      }
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

// Update notification status
const updateNotificationStatus = async (req, res, next) => {
  const userId = req.user._id;
  const { notificationId, status } = req.body;

  console.log(`Received notificationId: ${notificationId}, userId: ${userId}`);

  try {
      const user = await User.findById(userId);
      if (!user) {
          console.log('User not found');
          return res.status(404).json({ message: 'User not found' });
      }

      await user.updateNotificationStatus(notificationId, status);
      res.json({ statusCode: 200, message: 'update notification status success' });
  } catch (error) {
      console.error('Error updating notification status:', error);
      res.status(500).json({ message: 'Failed to update notification status' });
  }
};
module.exports = {
  getNotifications,
  updateNotificationStatus,
};
