const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const userSchema = new mongoose.Schema({
    Name: {
        type: String,
        minlength: 3,
        maxlength: 50,
        required: true
    },
    UserName: {
        type: String,
        unique: true,
        sparse: true
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email format");
            }
        }
    },
    password: {
        type: String,
        minlength: 6
    },
    stream: {
        type: String
    },
    class: {
        type: String
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    profilePicture: {
        type: String
    },
    date: { type: Date, default: Date.now },
});

userSchema.methods.getJWT = async function(){
  const user = this;
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET || "Libaray@8899", {expiresIn:"7d"});
  return token;
}
userSchema.methods.validatePassword = async function(passwordinputByUser) {
  const user = this;
  if (!user.password) {
    return false; // User registered with Google OAuth, no password
  }
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(
    passwordinputByUser,
    passwordHash
  );
  return isPasswordValid;
};
const User = mongoose.model('User', userSchema);
module.exports = User;