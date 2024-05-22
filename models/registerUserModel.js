let client = require('../dbConnection');
client.connect();
let collection = client.db().collection('users');

async function insertUser(user){
  console.log('Test Model Register User1');
    return collection.insertOne(user);
}

module.exports = {insertUser};