
var express = require("express");
var router = express.Router();
const path = require("path"); // Import the path module
const medicationController = require('../controllers/medicationController');

router.get('/', function (req, res, html) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});
router.get('/page1', function(req, res, html){
    res.sendFile(path.join(__dirname, '../public/views/med_manager/index.html'));
});
router.get('/getpills', medicationController.getAllMedications);

router.get('/page3', function(req, res, html){
    res.sendFile(path.join(__dirname, '../public/views/symptom_checker/index.html'));
});
module.exports = router;
