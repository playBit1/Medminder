// routes/profile.js
const express = require('express');
const { authenticate } = require('../controllers/user_auth');
const userProfileController = require('../controllers/userProfileController');
const path = require('path'); // Import the path module
const router = express.Router();

router.get('/', authenticate, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/views/profiles/profiles.html'));
});

router.get('/details', authenticate, (req, res) => {
  res.json({
    user_first_name: req.user.user_first_name,
    user_last_name: req.user.user_last_name,
    user_email: req.user.user_email,
  });
});

router.post(
  '/updateprofile',
  authenticate,
  userProfileController.updateProfile
);

module.exports = router;
