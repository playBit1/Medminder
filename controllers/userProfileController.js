const User = require('../models/User');

exports.updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { user_first_name, user_last_name, user_email, user_password } =
    req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.user_first_name = user_first_name;
    user.user_last_name = user_last_name;
    user.user_email = user_email;
    if (user_password) {
      user.user_password = user_password; // Ensure password is hashed before saving it
    }

    await user.save();
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
