const express = require("express");
const mongoose = require("mongoose");
const Borrow = require("../model/Borrow");
const Book = require("../model/books");
const borrowRouter = express.Router();



borrowRouter.post("/borrow/:bookId", async (req, res) => {
  try {
    // 📌 Get data
    const bookId = req.params.bookId;
    const userId = req.body._id; 

    // 📌 Validate input
    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    // 📌 Find book
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    // 📌 Check duplicate borrow
    const alreadyBorrowed = await Borrow.findOne({
      userId,
      bookId,
      status: "borrowed",
    });

    if (alreadyBorrowed) {
      return res.status(400).json({
        message: "You already borrowed this book",
      });
    }

    // 📌 Check availability
    if (book.availableCopies <= 0) {
      return res.status(400).json({
        message: "No copies available for this book",
      });
    }

    // 📌 Create borrow record
    const borrow = await Borrow.create({
      userId: userId,
      bookId: bookId,
      status: "borrowed",
    });

    // 📌 Update book copies
    book.availableCopies -= 1;
    await book.save();

    // 📌 Success response
    res.status(201).json({
      message: "Book borrowed successfully",
      borrow,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error borrowing book",
      error: error.message,
    });
  }
});

borrowRouter.post("/return/:borrowId", async (req, res) => {
  try {
    // 📌 Get borrowId
    const borrowId = req.params.borrowId;

    // 📌 Find borrow record
    const borrowRecord = await Borrow.findById(borrowId);

    if (!borrowRecord) {
      return res.status(404).json({
        message: "Borrow record not found",
      });
    }

    // 📌 Check if already returned
    if (borrowRecord.status === "returned") {
      return res.status(400).json({
        message: "Book already returned",
      });
    }

    // 📌 Find book
    const book = await Book.findById(borrowRecord.bookId);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    // 📌 Update borrow record
    borrowRecord.status = "returned";
    borrowRecord.returnedAt = new Date();

    await borrowRecord.save();

    // 📌 Increase available copies
    book.availableCopies += 1;
    await book.save();

    // 📌 Success response
    res.status(200).json({
      message: "Book returned successfully",
      borrow: borrowRecord,
    });

  } catch (err) {
    res.status(500).json({
      message: "Error returning book",
      error: err.message,
    });
  }
});

borrowRouter.get('/my-books/:userId', async (req, res) => {
  try{
    const userId = req.params.userId;

    const borrowedBooks = await Borrow.find({ userId, status: "borrowed" }).populate('bookId');
    res.status(200).json({
      message: "Borrowed books fetched successfully",
      borrowedBooks,
    })

  }catch(err){
    res.status(500).json({
      message: "Error fetching borrowed books",
      error: err.message,
    });
  }
});

module.exports = borrowRouter;
