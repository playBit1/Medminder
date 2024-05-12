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
        time2: { type: String, required: true },
        time3: { type: String, required: true },
        time4: { type: String, required: true },
      },
      start_date: { type: Date, required: true },
      end_date: { type: Date, required: true },
    }),
  },
});

// Hash the password before saving it to the database
userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('user_password')) return next();

  console.log(user);
  try {
    const salt = await bcrypt.genSalt();
    user.user_password = await bcrypt.hash(user.user_password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});

// Compare the given password with the hashed password in the database
userSchema.methods.comparePassword = async function (password) {
  console.log(password, ' + ', this.user_password);
  return bcrypt.compare(password, this.user_password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
