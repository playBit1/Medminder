const express = require('express');
const { authenticate } = require('../controllers/user_auth');
const path = require("path"); // Import the path module
const router = express.Router();

router.get('/profile', authenticate, (req, res) => {
  res.json({ message: `Welcome ${req.user.user_first_name}` });
});

router.get('/login', function (req, res, html) {
  res.sendFile(path.join(__dirname, '../public/views/login/index.html'));
});

router.get('/register', function (req, res, html) {
  res.sendFile(path.join(__dirname, '../public/views/register/index.html'));
});

module.exports = router;
