const jwt = require ('jsonwebtoken');
const JWT_SECRET = "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?[]]pou89ywe";
const nodemailer = require('nodemailer');
const User = require('../models/User');
const path = require('path');

const findUserByEmail = async (email) => {
  return await User.findOne({ user_email: email });
};

const findUserById = async (id) => {
  return await User.findOne({ _id: id });
};

const handleErrorResponse = (res, err, message) => {
  console.error(message, err);
  res.status(500).json({ statusCode: 500, message: 'Internal server error' });
};

const sendEmail = async function (req, res) {
  const { email } = req.body;
  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ statusCode: 404, message: 'User not found' });
    }

    const secret = JWT_SECRET + user.user_password;
    const token = jwt.sign({ email: user.user_email, id: user._id }, secret, {
      expiresIn: "50m",
    });

    const link = `http://localhost:3000/forgotPassword/${token}/${user._id}`;

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    var mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Please Reset Your Password",
      text: link
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log('Error occurred: ' + error.message);
        res.status(500).json({ statusCode: 500, message: 'Failed to send email', error: error.message });
      } else {
        console.log('Email sent: ' + info.response);
        res.status(200).json({ statusCode: 200, message: 'Email sent successfully' });
      }
    });
  } catch (err) {
    handleErrorResponse(res, err, 'Error sending emails:');
  }
}

const resetPasswordGet = async function(req, res) {
  const { id, token } = req.params;

  try {
    const user = await findUserById(id);

    if (!user) {
      return res.status(404).json({ statusCode: 404, message: 'User not found' });
    }

    const secret = JWT_SECRET + user.user_password;
    const verify = jwt.verify(token, secret);

    if (!verify) {
      handleErrorResponse(res, err, 'Link not valid:');
    }

    res.sendFile(
      path.join(__dirname, '../public/views/forget_password/resetPassword.html'));
  } catch (err) {
    handleErrorResponse(res, err, 'Error getting reset password link:');
  }
  
};

const resetPasswordPost = async function(req, res) {
  const { id, token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await findUserById(id);

    if (!user) {
      return res.status(404).json({ statusCode: 404, message: 'User not found' });
    }

    const secret = JWT_SECRET + user.user_password;
    const verify = jwt.verify(token, secret);

    if (!verify) {
      handleErrorResponse(res, err, 'Link not valid:');
    }

    const result = await user.updatePassword(newPassword);
    console.log(result);
    
  } catch (err) {
    handleErrorResponse(res, err, 'Error getting reset password link:');
  }
}

module.exports = {
  sendEmail,
  resetPasswordGet,
  resetPasswordPost
};