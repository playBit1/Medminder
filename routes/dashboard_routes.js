var express = require('express');
var router = express.Router();
const path = require('path');
var dashboardController = require("../controllers/dashboardController");
const { authenticate } = require('../controllers/user_auth');

router.get('/', function (req, res) {
  res.sendFile(
    path.join(__dirname, '../public/views/dashboard/index.html')
  );
});

router.get('/getAllNotifications', authenticate, dashboardController.getAllNotifications);

router.post('/updateNotificationStatus', authenticate, dashboardController.updateNotificationStatus);

module.exports = router;
