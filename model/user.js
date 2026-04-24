const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    Name: {
        type: String,
        minlength: 3,
        maxlength: 50,
        required: true
    },
    UserName: {
        type: String,
        required: false,
        unique: true
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
        required: false,
        minlength: 6
    },
    stream: {
        type: String,
        required: false
    },
    class: {
        type: String,
        required: false
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    isGoogleUser: {
        type: Boolean,
        default: false
    },
    date: { type: Date, default: Date.now },
});

userSchema.methods.getJWT = async function(){
  const user = this;
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  return token;
}
userSchema.methods.validatePassword = async function(passwordinputByUser) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(
    passwordinputByUser,
    passwordHash
  );
  return isPasswordValid;
};
const User = mongoose.model('User', userSchema);
module.exports = User;