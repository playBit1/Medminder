const { ObjectId } = require('mongodb');
let client = require('../dbConnection');
client.connect();
let collection = client.db().collection('testRegisterUser');
// const mongoose = require('mongoose');
// const { collection } = require('./User');

async function insertUser(user){
  console.log('Test Model Register User1', user);
    return collection.insertOne(user);
}

async function getUserByEmailId(email){
  console.log('Test Model Find User1');
  const ret = await collection.findOne({ user_email:  email});
  return ret;
}

async function getUserById(id){
  console.log('Test Model Find User1 by id',id);
  const ret = await collection.findOne({ _id:  new ObjectId(id)});
  return ret;
}

async function updateUser(id, password){
  console.log('Test Model Find User1', id);
  console.log('Test Model Find User1', password);
  await collection.updateOne({ _id:  new ObjectId(id)}, {$set: {
    user_password: password}}

    )};
    console.log('function end');


module.exports = {insertUser, getUserByEmailId, updateUser, getUserById};