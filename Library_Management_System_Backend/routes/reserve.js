const express = require('express');
const reserveRouter = express.Router();

reserveRouter.post('/reserve/:bookId', async (req, res) => {
    try {
        const { userId, bookId } = req.body;

        const reservation = new Reservation({
            userId,
            bookId
        });

        await reservation.save();
        res.status(201).json({ message: 'Book reserved successfully', reservation });
    }catch(err){
        res.status(400).json({ message: err.message });
    }
});
module.exports = reserveRouter;