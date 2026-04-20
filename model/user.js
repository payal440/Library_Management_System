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
        required: true,
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
        required: true,
        minlength: 6
    },
    stream: {
        type: String,
        required: true
    },
    class: {
        type: String,
        required: true
    },
    date: { type: Date, default: Date.now },
});

userSchema.methods.getJWT = async function(){
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "Libaray@8899",{expiresIn:"7d",
  });
 
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