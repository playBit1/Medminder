const express = require('express');
const { authenticate } = require('../controllers/user_auth');

const router = express.Router();

router.get('/profile', authenticate, (req, res) => {
  res.json({ message: `Welcome ${req.user.user_first_name}` });
});

module.exports = router;
