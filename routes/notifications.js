const express = require('express');
const router = express.Router();
const { getNotifications, updateNotificationStatus } = require('../controllers/notifications');
const { authenticate } = require('../controllers/user_auth');

router.get('/', authenticate, getNotifications);
router.post('/taken/:medicationId', authenticate, updateNotificationStatus);

module.exports = router;
