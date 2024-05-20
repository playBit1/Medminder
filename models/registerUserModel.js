let client = require('../dbConnection');
client.connect();
let collection = client.db().collection('testRegisterUser');

async function insertUser(user){
  console.log('Test Model Register User1');
    return collection.insertOne(user);
}

// async function getAllCats(){
//     return collection.find().toArray();
// }

module.exports = {insertUser};

//module.exports = {insertUser, getAllCats};

/*
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  user_email: { type: String, required: true, unique: true },
  user_password: { type: String, required: true },
  user_first_name: { type: String, required: true },
  user_last_name: { type: String, required: true },
  user_gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
    required: true,
  },
  user_medication: {
    type: Map,
    of: new mongoose.Schema({
      medication_name: { type: String, required: true, unique: true },
      dosage: { type: String, required: true },
      frequency: {
        type: String,
        enum: [
          'Once a day',
          'Twice a day',
          'Three times a day',
          'Four times a day',
        ],
        default: 'Once a day',
      },
      time: {
        time1: { type: String, required: true },
        time2: { type: String },
        time3: { type: String },
        time4: { type: String },
      },
      start_date: { type: Date, required: true },
      end_date: { type: Date, required: true },
    }),
  },
});

// get user's medications
userSchema.statics.getAllUserMedications = async function () {
  try {
    const users = await this.find({});
    const medicationList = users.map(user => user.user_medication);
    return medicationList;
  } catch (error) {
    throw error;
  }
};

// add new medication to user's record
userSchema.methods.addMedication = async function (newMedication) {
  try {
    this.user_medication.set(newMedication.medication_name, {
      dosage: newMedication.dosage,
      frequency: newMedication.frequency,
      time: {
        time1: newMedication.time1,
        time2: newMedication.time2,
        time3: newMedication.time3,
        time4: newMedication.time4,
      },
      start_date: newMedication.start_date,
      end_date: newMedication.end_date,
    });

    await this.save();
    return { message: 'Medication added successfully' };
  } catch (error) {
    throw error;
  }
};

// Hashing the password before saving it
userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();

  //console.log(user);
  try {
    const salt = await bcrypt.genSalt();
    user.user_password = await bcrypt.hash(user.user_password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});

// Compare the given password with the hashed password in database
userSchema.methods.comparePassword = async function (password) {
  //console.log(password, ' + ', this.user_password);
  return bcrypt.compare(password, this.user_password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
*/