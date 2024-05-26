const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
require('dotenv').config();

// Register a new user
const register = async (req, res, next) => {
  const {
    user_email,
    user_password,
    user_first_name,
    user_last_name,
    user_gender,
    user_medication,
  } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user_password, salt);

    const user = new User({
      user_email,
      user_password: hashedPassword,
      user_first_name,
      user_last_name,
      user_gender,
      user_medication,
    });
    await user.save();
    res.json({ message: 'Registration successful' });
  } catch (error) {
    next(error);
  }
};

// Login with an existing user
const login = async (req, res, next) => {
  const { user_email, user_password } = req.body;

  try {
    const user = await User.findOne({ user_email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordMatch = await user.comparePassword(user_password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: '1 hour',
    });

    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour access
    res.json({ message: 'Login successful' });
  } catch (error) {
    next(error);
  }
};

// Logout a user
const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logout successful' });
};

module.exports = { register, login, logout };
