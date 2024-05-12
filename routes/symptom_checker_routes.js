var express = require('express');
var router = express.Router();
const path = require('path');

router.get('/', function (req, res) {
  res.sendFile(
    path.join(__dirname, '../public/views/symptom_checker/index.html')
  );
});

module.exports = router;
