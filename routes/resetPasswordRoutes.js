let express = require('express');
let router = express.Router();
let controller = require('../controllers/forgotPasswordController');
const path = require('path');


router.get('/:token/:id', async function (req, res) {
  console.log('Router Reset Password Get');
  let flag = await controller.resetPasswordGet(req,res);
  if (flag) {
    res.sendFile(
      path.join(__dirname, '../public/index - Forgot Password New Password.html'));
  }
  else{
    res.json({statusCode: 201, message: 'Something Went Wrong'});
  }
  
});

router.post('/:token/:id', async function(req, res) {
  const htmlContent = console.log('Reset Password Route Post');
  let flag = await controller.resetPasswordPost(req,res);
  if (flag) {
    console.log('Path to Login Page After Reset');
    }
  else{
    res.json({statusCode: 201, message: 'Something Went Wrong'});
  }
 });



module.exports = router;
