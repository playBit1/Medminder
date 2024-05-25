let express = require('express');
const model = require('../models/registerUserModel');
const bcryptjs = require ('bcryptjs');
const config = require('../config/config');
const jwt = require ('jsonwebtoken');
const JWT_SECRET = "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?[]]pou89ywe";

const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
//const User = require('../models/User');


const sendResetPasswordMail = async(name, email, token)=>{
    try {
        const transporter = nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:config.emailUser,
                password:config.emailPassword
            }

        });

        const mailOptions = {
            from:config.emailUser,
            to: email,
            subject: 'Please reset Your Password',
            html: '<p> Hi '+name+', Please copy the link and <a href="http://localhost:3000/resetPassword?token='+token+'"> reset your password.</a>'
        }
        transporter.sendMail(mailOptions,function(error,info){
            if (error){
                console.log(error);
            } 
            else
            {
                console.log('Mail has been Sent:-', info.response)
            }
        })

    } catch (error) {
        res.status(400).send({success:false, msg:error.message});
    }
}



const forgotPassword = async function(req, res) {
        const { email } = req.body;
        try {
          const oldUser = await model.getUserByEmailId(email);

          console.log('Old User', oldUser);
          if (!oldUser) {
            return res.json({ status: "User Not Exists!!" });
          }
          const secret = JWT_SECRET + oldUser.password;
          const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
            expiresIn: "50m",
          });
          const link = `http://localhost:3000/resetPassword/${token}/${oldUser._id}`;
          console.log('Creating Transporter');
          var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: config.emailUser,
              pass: config.emailPassword,
            },

          });
      
          var mailOptions = {
            from: config.emailUser,
            to: email,
            subject: "Please Reset Your Password",
            text: link,
          };
      
          console.log('Sending Email');
          transporter.sendMail(mailOptions, function (error, info) {
            
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });
          console.log('Forgot Password',link);
          return "Password Reset Email Sent";
        } catch (error) {}
      }; 
    

const resetPasswordGet = async function(req, res) {
    const { id, token } = req.params;
    console.log(req.params);
    
    const oldUser = await model.getUserById(id);
    console.log('User Old', oldUser);
    if (!oldUser) {
      return false;
    }
    const secret = JWT_SECRET + oldUser.password;
    try {
      const verify = jwt.verify(token, secret);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  
  const resetPasswordPost = async function(req, res) {
    const { id, token } = req.params;
    const { newPassword } = req.body;
  
    const oldUser = await model.getUserById(id);
    console.log('User in Post Reset Password', oldUser);
    if (!oldUser) {
      return false;
    }
    const secret = JWT_SECRET + oldUser.password;
    try {
      const verify = jwt.verify(token, secret);
      const encryptedPassword = await bcryptjs.hash(newPassword, 10);
      await model.updateUser(id, encryptedPassword);
      console.log('Password Updated for user');
      return true;
    } catch (error) {
      console.log(error);
      res.json({ status: "Something Went Wrong" });
      return false;
    }
  };


module.exports = {forgotPassword, resetPasswordGet, resetPasswordPost};