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
  user_notifications: {
    type: Map,
    of: new mongoose.Schema({
      medication_id: {type: String, required: true},
      medication_name: { type: String, required: true },
      date: { type: String, required: true },
      time: { type: String, required: true },
      status: {
        type: String,
        enum: [
          'Taken',
          'Not taken',
          'Skipped'
        ],
        default: 'Not taken',
      }
    })
  }
});

// get user's medications
userSchema.methods.getAllUserMedications = async function () {
  try {
    return this.user_medication;
  } catch (error) {
    throw error;
  }
};

// get user's notifications
userSchema.methods.getAllNotifications = async function () {
  try {
    return this.user_notifications;
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

// Utility function to find a list of notifications by medication ID
userSchema.methods.findNotificationsByMedicationId = function (medicationId) {
  var arr = [];
  for (const [key, notification] of this.user_notifications.entries()) {
    if (notification.medication_id === medicationId) {
      arr.push({key, notification});
    }
  }
  return arr;
}

// Utility function to find a list of notifications by medication ID
userSchema.methods.findNotificationByNotificationId = function (notificationId) {
  for (const [key, notification] of this.user_notifications.entries()) {
    if (notification._id.toString() === notificationId) {
      return {key, notification};
    }
  }
  return null;
}

// Utility function to generate notifications
userSchema.methods.generateNotifications = function (newMedication, newMedIdString) {
  const startDate = new Date(newMedication.start_date);
  const endDate = new Date(newMedication.end_date);
  const timeKeys = ['time1', 'time2', 'time3', 'time4'];
  const reminderTimes = timeKeys
    .map(key => newMedication.time[key])
    .filter(time => time); // Filter out undefined or null times

  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    for (const time of reminderTimes) {
      const notificationId = new mongoose.Types.ObjectId(); // Generate a new ObjectId for the notification
      const notificationDate = currentDate.toISOString().split('T')[0]; // Get date in YYYY-MM-DD format

      this.user_notifications.set(notificationId.toString(), {
        medication_id: newMedIdString,
        medication_name: newMedication.medication_name,
        date: notificationDate,
        time: time,
        status: 'Not taken',
      });
    }
    currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
  }
};

userSchema.methods.deleteNotifications = function (medicationId) {
  const notifications = this.findNotificationsByMedicationId(medicationId);
  notifications.forEach(({ key }) => this.user_notifications.delete(key));
}

// add new medication
userSchema.methods.addNewMedication = async function (newMedication) {
  try {
    // Ensure user_medication is initialized as a Map
    this.user_medication = this.user_medication || new Map();
    this.user_notifications = this.user_notifications || new Map();

    const newMedId = new mongoose.Types.ObjectId(); // Generate a new ObjectId
    const newMedIdString = newMedId.toString();
    this.user_medication.set(newMedIdString, {
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
      _id: newMedId
    });

    // Generate notifications for each reminder time
    this.generateNotifications(newMedication, newMedIdString);
    
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
    this.user_notifications = this.user_notifications || new Map();

    const found_medication = this.findMedicationById(medicationId);
    if (!found_medication) {
      throw new Error('Medication not found');
    }

    // Update the medication details
    const { key, medication } = found_medication;
    Object.assign(medication, updatedMedication);

    // Remove existing notifications for this medication
    this.deleteNotifications(medicationId);

    // Generate new notifications for the updated medication
    this.generateNotifications(updatedMedication, medicationId.toString());

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

    // Remove existing notifications for this medication
    this.deleteNotifications(medicationId);

    this.user_medication.delete(found.key);
    await this.save();
    return { message: 'Medication deleted successfully' };
  } catch (error) {
    throw error;
  }
};

// edit medication
userSchema.methods.updateNotificationStatus = async function (notificationId, status) {
  try {
    // Ensure user_medication is initialized as a Map
    this.user_notifications = this.user_notifications || new Map();

    const found_notification = this.findNotificationByNotificationId(notificationId);
    if (!found_notification) {
      throw new Error('Notification not found');
    }

    // Update the status of the found notification
    const { key, notification } = found_notification;
    notification.status = status;

    // Save the changes to the database
    this.user_notifications.set(key, notification);
    await this.save();
    
    return { message: 'Notification updated successfully' };
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

// Method to update notification status
userSchema.methods.updateNotificationStatus = async function (notificationId, status) {
  const notification = this.user_notifications.get(notificationId);
  if (notification) {
    notification.status = status;
    this.user_notifications.set(notificationId, notification);
    await this.save();
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User;
