let express = require('express');
let model = require('../models/registerUserModel');

const insertUser = async function(req, res) {
    let user = req.body;
    console.log ('User Going Controller', user);
    return model.insertUser(user);
}

module.exports = {insertUser};