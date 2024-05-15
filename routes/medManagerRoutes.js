
var express = require("express");
var router = express.Router();
var medManagerController = require("../controllers/medManagerController");
const path = require("path"); // Import the path module

router.get('/index', function (req, res, html) {
    res.sendFile(path.join(__dirname, '../public/views/med_manager/index.html'));
});

router.get('/getMeds', medManagerController.getAllMedication);

router.post('/addMed', medManagerController.addMedication);

module.exports = router;
