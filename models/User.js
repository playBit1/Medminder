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
      medication_name: { type: String, required: true },
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
    }, { _id: true }),
  },
});

// get user's medications
userSchema.methods.getAllUserMedications = async function () {
  try {
    return this.user_medication;
  } catch (error) {
    throw error;
  }
};

// add new medication
userSchema.methods.addNewMedication = async function (newMedication) {
  try {
    // Ensure user_medication is initialized as a Map
    this.user_medication = this.user_medication || new Map();

    const newMedId = new mongoose.Types.ObjectId(); // Generate a new ObjectId
    this.user_medication.set(newMedId.toString(), {
      medication_name: newMedication.medication_name,
      dosage: newMedication.dosage,
      frequency: newMedication.frequency,
      time: {
        time1: newMedication.time.time1,
        time2: newMedication.time.time2,
        time3: newMedication.time.time3,
        time4: newMedication.time.time4,
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

// edit medication
userSchema.methods.editMedication = async function (medicationId, updatedMedication) {
  try {
    // Ensure user_medication is initialized as a Map
    this.user_medication = this.user_medication || new Map();

    // Convert medicationId to a string if it isn't already
    const medicationIdStr = medicationId.toString();

    // Find the medication by iterating through the map
    let medicationToUpdate = null;
    for (let [key, medication] of this.user_medication.entries()) {
      if (medication._id.toString() === medicationIdStr) {
        medicationToUpdate = medication;
        break;
      }
    }

    // Check if the medication with the provided ID exists
    if (!medicationToUpdate) {
      throw new Error('Medication not found');
    }

    // Update the medication details
    medicationToUpdate.medication_name = updatedMedication.medication_name || medicationToUpdate.medication_name;
    medicationToUpdate.dosage = updatedMedication.dosage || medicationToUpdate.dosage;
    medicationToUpdate.frequency = updatedMedication.frequency || medicationToUpdate.frequency;
    medicationToUpdate.time.time1 = updatedMedication.time.time1 || medicationToUpdate.time.time1;
    medicationToUpdate.time.time2 = updatedMedication.time.time2 || medicationToUpdate.time.time2;
    medicationToUpdate.time.time3 = updatedMedication.time.time3 || medicationToUpdate.time.time3;
    medicationToUpdate.time.time4 = updatedMedication.time.time4 || medicationToUpdate.time.time4;
    medicationToUpdate.start_date = updatedMedication.start_date || medicationToUpdate.start_date;
    medicationToUpdate.end_date = updatedMedication.end_date || medicationToUpdate.end_date;

    // Save the changes to the database
    await this.save();
    
    return { message: 'Medication updated successfully', updatedMedication: medicationToUpdate };
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
