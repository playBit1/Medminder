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
// router.get('/api/user', async function(req, res){
//   let result = await controller.getAllCats(req,res);
//   res.json({statusCode: 200, message: 'success', data: result});
// });

module.exports = router;


/*
var express = require('express');
var router = express.Router();
const path = require('path');

router.get('/', function (req, res) {
  res.sendFile(
    path.join(__dirname, '../public/views/symptom_checker/index.html')
  );
});

module.exports = router;
*/