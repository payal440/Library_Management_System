const express = require('express');
const profileRouter = express.Router();
const userAuth = require('../middleware/auth');
const User = require('../model/user');
const { validateprofileEditData } = require('../utils/validation');

profileRouter.get('/profile', userAuth, async (req, res) => {
    try {
        const user = req.user;
        console.log("=== GET /profile ===");
        console.log("user from auth middleware:", user);
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
        console.log("=== PATCH /profile/edit ===");
        console.log("User ID from auth middleware:", userId);
        console.log("update data:", { name, email });

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { Name: name, emailId: email },
            { new: true, runValidators: true }
        );
        
        console.log("User updated:", updatedUser);
        res.json(updatedUser);
    }catch(err){
        res.status(400).json({ message: err.message });
    }
})
module.exports = profileRouter;