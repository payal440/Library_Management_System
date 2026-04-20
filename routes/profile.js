const express = require('express');
const profileRouter = express.Router();
const userAuth = require('../middleware/auth');
const User = require('../model/user');
const { validateprofileEditData } = require('../utils/validation');

profileRouter.get('/profile', userAuth, async (req, res) => {
    try {
        const user = req.user;
        console.log(user);
        res.json({ user });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }

});

profileRouter.patch('/profile/edit', userAuth,async(req,res)=>{
    try{
        const userId = req.user._id;
        const { name, email } = req.body;
    }catch(err){
        res.status(400).json({ message: err.message });
    }
})
module.exports = profileRouter;