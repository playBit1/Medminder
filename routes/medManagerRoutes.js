
var express = require("express");
var router = express.Router();
const path = require("path"); // Import the path module

router.get('/index', function (req, res, html) {
    res.sendFile(path.join(__dirname, '../public/views/med_manager/index.html'));
});

module.exports = router;