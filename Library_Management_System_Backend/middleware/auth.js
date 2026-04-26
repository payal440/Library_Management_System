const jwt = require('jsonwebtoken');
const validator = require('validator');
const User = require('../model/user');
require('dotenv').config();

const userAuth = async (req,res,next)=>{
    try{
            // Try to get token from cookies or Authorization header
            const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
            if(!token){
                throw new Error("token is not valid")
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET || "Libaray@8899");
            const user = await User.findById({ _id: decoded._id });
    if (!user) {
      throw new Error("user not found");
    }
    req.user = user; 
    next();
    }catch(err){
        res.status(401).json({message: err.message});
    }
}
module.exports = userAuth;