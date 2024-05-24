const express = require('express');
const router = express.Router();

const { getNotifications, updateNotificationStatus } = require('../controllers/notifications');
const { authenticate } = require('../controllers/user_auth');

router.get('/', authenticate, getNotifications);

router.post('/:action/:id', authenticate, async (req, res) => {
  const { action, id } = req.params;
  const status = action === 'taken' ? 'Taken' : 'Skipped';

  try {
    req.body.notificationId = id;
    req.body.status = status;
    await updateNotificationStatus(req, res);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update notification status' });
  }
});

module.exports = router;
