const nodemailer = require('nodemailer');
const {mailKeys} = require('../config/keys')


let transport = nodemailer.createTransport(mailKeys);
  
const mailHandler = {
  sendConfirmation: async (email, token) => {
    const message = {
        from: 'noreply@hypertube.com', 
        to: email,        
        subject: 'Account confirmation',
        html: `<h1>Welcome to Hypertube</h1><br>\
        <h3>Please confirm your account by visiting the link below</h3>\
        <a style="color: blue;" href=\"http://134.209.183.92/users/confirm/${token}\">Confirm</a>` 
      };
      transport.sendMail(message, (err, info) =>{
        if (err) {
          throw new Error("email was not sent, please check email and try again ...")
        } else {
          return true
        }
      })
  },
  sendReset: async (email, token) => {
    const message = {
        from: 'noreply@hypertube.com', 
        to: email,        
        subject: 'Reset Password email',
        html: `<h1>Hypertube</h1><br>\
        <h3>Please visiting the link below so we can send your reset password email</h3>\
        <a style="color: red;" href=\"http://134.209.183.92/users/reset/${token}\">Reset</a>\
        <br>
        <p>If you have not requested your password to be reset do not click reset, contact support at: support@hypertube.com</p>` 
      };
      transport.sendMail(message, (err, info) =>{
        if (err) {
          throw new Error("email was not sent, please check email and try again ...")
        } else {
          return true
        }
      })
  },
  sendConfirmed: async (email, name) => {
    const message = {
      from: 'noreply@hypertube.com', 
      to: email,        
      subject: 'Account Confirmed',
      html: `<h1>Hypertube</h1><br>\
      <h3>Congratulations ${name} Your Account has been activated, login using the link bellow to start watching the latest movies</h3>\
      <a style="color: red;" href=\"http://134.209.183.92/auth/login\">Login</a>\
      <br>
      <p>If you cant access your account, contact support at: support@hypertube.com</p>` 
    };
    transport.sendMail(message, (err, info) =>{
      if (err) {
        throw new Error("email was not sent, please check email and try again ...")
      } else {
        return true
      }
    })
  }
}




  module.exports = mailHandler