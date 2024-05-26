
var express = require("express");
var router = express.Router();
var medManagerController = require("../controllers/medManagerController");
const path = require("path"); // Import the path module
const { authenticate } = require('../controllers/user_auth');

router.get('/', authenticate, function (req, res, html) {
    res.sendFile(path.join(__dirname, '../public/views/med_manager/index.html'));
});

router.get('/getMeds', authenticate, medManagerController.getAllMedication);

router.post('/addMed', authenticate, medManagerController.addMedication);

router.post('/editMed', authenticate, medManagerController.editMedication);

router.post('/deleteMed', authenticate, medManagerController.deleteMedication);

router.post('/sendEmail', authenticate, medManagerController.sendEmail);

module.exports = router;
