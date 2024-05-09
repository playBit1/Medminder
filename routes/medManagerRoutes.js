
var express = require("express");
var router = express.Router();
const path = require("path"); // Import the path module

router.get('/', function (req, res, html) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});
router.get('/page1', function(req, res, html){
    res.sendFile(path.join(__dirname, '../public/views/med_manager/index.html'));
});
router.get('/page2', function(req, res, html){
    res.sendFile(path.join(__dirname, '../public/views/dashboard/index.html'));
});
router.get('/page3', function(req, res, html){
    res.sendFile(path.join(__dirname, '../public/views/symptom_checker/index.html'));
});
module.exports = router;
