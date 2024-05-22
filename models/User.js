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

// Utility function to find a medication by ID
userSchema.methods.findMedicationById = function (medicationId) {
  const medicationIdStr = medicationId.toString();
  for (const [key, medication] of this.user_medication.entries()) {
    if (medication._id.toString() === medicationIdStr) {
      return { key, medication };
    }
  }
  return null;
}; 

// edit medication
userSchema.methods.editMedication = async function (medicationId, updatedMedication) {
  try {
    // Ensure user_medication is initialized as a Map
    this.user_medication = this.user_medication || new Map();

    // Convert medicationId to a string if it isn't already
    const found = this.findMedicationById(medicationId);
    if (!found) {
      throw new Error('Medication not found');
    } 

    // Update the medication details
    const { key, medication } = found;
    Object.assign(medication, updatedMedication);

    // Save the changes to the database
    this.user_medication.set(key, medication);
    await this.save();
    
    return { message: 'Medication updated successfully', updatedMedication: updatedMedication };
  } catch (error) {
    throw error;
  }
};

// delete medication
userSchema.methods.deleteMedication = async function (medicationId) {
  try {
    const found = this.findMedicationById(medicationId);
    if (!found) {
      throw new Error('Medication not found');
    }

    this.user_medication.delete(found.key);
    await this.save();
    return { message: 'Medication deleted successfully' };
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
