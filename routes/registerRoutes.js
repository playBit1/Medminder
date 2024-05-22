let express = require('express');
let router = express.Router();
let controller = require('../controllers/registerController');
const path = require('path');

router.post('/', async function(req, res) {
  console.log('Test Route1');
  let result = await controller.insertUser(req,res);
  res.json({statusCode: 201, message: 'success', data: result});
});

router.get('/', function (req, res) {
  res.sendFile(
    path.join(__dirname, '../public/views/landingpage/index - JoinUs.html')
  );
});

module.exports = router;