const jwt = require('jsonwebtoken');
const validator = require('validator');
const User = require('../model/user');

const userAuth = async (req,res,next)=>{
    try{
            const token = req.cookies?.token;
            if(!token){
                throw new Error("token is not valid")
            }

            const decoded = jwt.verify(token,"Libaray@8899");
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