let express = require('express');
let router = express.Router();
let controller = require('../controllers/forgotPasswordController');
const path = require('path');

router.get('/confirmEmail', function (req, res) {
  res.sendFile(
    path.join(__dirname, '../public/views/forget_password/confirmEmail.html')
  );
});

router.get('/resetPassword', function (req, res) {
  res.sendFile(
    path.join(__dirname, '../public/views/forget_password/resetPassword.html')
  );
});

router.post('/sendEmail', controller.sendEmail);

router.get('/:token/:id', controller.resetPasswordGet);

router.post('/:token/:id', controller.resetPasswordPost);

module.exports = router;
