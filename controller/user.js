
const User = require('../models/users');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const PasswordReset = require('../models/passwordResets');


function isstringinvalid(string){
    if(string == undefined ||string.length === 0){
        return true
    } else {
        return false
    }
}

 const signup = async (req, res)=>{
    try{
    const { name, email, password } = req.body;
    console.log('email', email)
    if(isstringinvalid(name) || isstringinvalid(email || isstringinvalid(password))){
        return res.status(400).json({err: "Bad parameters . Something is missing"})
    }
    const saltrounds = 10;
    bcrypt.hash(password, saltrounds, async (err, hash) => {
        console.log(err)
        await User.create({ name, email, password: hash })
        res.status(201).json({message: 'Successfuly create new user'})
    })
    }catch(err) {
            res.status(500).json(err);
        }

}

const generateAccessToken = (id, name, ispremiumuser) => {
    return jwt.sign({ userId : id, name: name, ispremiumuser } ,'secretkey');
}

const login = async (req, res) => {
    try{
    const { email, password } = req.body;
    if(isstringinvalid(email) || isstringinvalid(password)){
        return res.status(400).json({message: 'EMail idor password is missing ', success: false})
    }
    console.log(password);
    const user  = await User.findAll({ where : { email }})
        if(user.length > 0){
           bcrypt.compare(password, user[0].password, (err, result) => {
           if(err){
            throw new Error('Something went wrong')
           }
            if(result === true){
                return res.status(200).json({success: true, message: "User logged in successfully", token: generateAccessToken(user[0].id, user[0].name, user[0].ispremiumuser)})
            }
            else{
            return res.status(400).json({success: false, message: 'Password is incorrect'})
           }
        })
        } else {
            return res.status(404).json({success: false, message: 'User Doesnot exitst'})
        }
    }catch(err){
        res.status(500).json({message: err, success: false})
    }
}

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Generate reset token and expiration
      const token = crypto.randomBytes(20).toString('hex');
      const expires = Date.now() + 3600000; // 1 hour
  
      // Store the token and expiration in the database
      await PasswordReset.create({
        userId: user.id,
        token: token,
        expires: expires,
        // Add order details here if needed
      });
  
      // Configure the mail transporter
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
  
      // Send email with the reset link
      const mailOptions = {
        to: user.email,
        from: 'passwordreset@demo.com',
        subject: 'Expense Tracker Password Reset',
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
              Please click on the following link, or paste this into your browser to complete the process:\n\n
              http://${req.headers.host}/reset/${token}\n\n
              If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      };
  
      transporter.sendMail(mailOptions, (err) => {
        if (err) {
          return res.status(500).json({ message: 'Error sending email' });
        }
        res.status(200).json({ message: 'Password reset link sent to your email' });
      });
    } catch (error) {
      res.status(500).json({ message: 'Error processing request' });
    }
  };

  const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
  
    try {
      const resetRequest = await PasswordReset.findOne({
        where: {
          token: token,
          expires: { [Op.gt]: Date.now() }, // Check if the token is still valid
        },
      });
  
      if (!resetRequest) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }
  
      const user = await User.findByPk(resetRequest.userId);
      user.password = password; // Consider hashing the password before saving
      await user.save();
  
      // Optionally, delete the reset request from the database
      await resetRequest.destroy();
  
      res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error resetting password' });
    }
  };
  

module.exports = {
    signup,
    login,
    generateAccessToken,
    forgotPassword,
    resetPassword

}

