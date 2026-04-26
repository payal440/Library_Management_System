const express = require('express');
const Reservation = require('../model/BookReserve');
const reserveRouter = express.Router();

reserveRouter.post('/reserve/:bookId', async (req, res) => {
    try {
        const userId = req.body.userId;
        const bookId = req.params.bookId;

        if (!userId || !bookId) {
            return res.status(400).json({ message: 'Both userId and bookId are required' });
        }

        const reservation = new Reservation({
            userId,
            bookId,
        });

        await reservation.save();
        res.status(201).json({ message: 'Book reserved successfully', reservation });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
module.exports = reserveRouter;