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

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try {
        const userId = req.user._id;
        const updates = req.body;

        const isValid = validateprofileEditData(req);
        if (!isValid) {
            return res.status(400).json({ message: 'Invalid profile update fields' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        Object.keys(updates).forEach((field) => {
            user[field] = updates[field];
        });

        await user.save();
        res.json({ message: 'Profile updated successfully', user });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
module.exports = profileRouter;