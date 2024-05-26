var express = require('express');
var router = express.Router();
const path = require('path');
const { authenticate } = require('../controllers/user_auth');

router.get('/', authenticate, function (req, res) {
  res.sendFile(
    path.join(__dirname, '../public/views/symptom_checker/index.html')
  );
});

module.exports = router;
