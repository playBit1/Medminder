let express = require('express');
let router = express.Router();
let controller = require('../controllers/forgotPasswordController');
const path = require('path');



router.post('/', async function(req, res) {
  console.log('Forgot Password Route');
  let result = await controller.forgotPassword(req,res);
  res.json({statusCode: 201, message: 'success'});
});



module.exports = router;
