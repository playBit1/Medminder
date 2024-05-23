const express = require('express');
const router = express.Router();
const path = require('path');

const { getNotifications, updateNotificationStatus } = require('../controllers/notifications');
const { authenticate } = require('../controllers/user_auth');

// Serve the HTML file for notifications
//router.get('/', authenticate, (req, res) => {
  //  res.sendFile(path.join(__dirname, '../public/views/nav/notifytest.html'));
//});
//router.get('/', authenticate, getNotifications);

// Separate endpoint for fetching notifications
router.get('/', authenticate, getNotifications);

router.post('/update', authenticate, updateNotificationStatus);

module.exports = router;
