const express = require("express");
const mongoose = require("mongoose");

const Book = require("../model/books");
const bookRouter = express.Router();

bookRouter.post("/books/add", async (req, res) => {
  try {
    const { title, author, totalCopies } = req.body;
    const newBook = new Book({
      title,
      author,
      totalCopies,
      availableCopies: totalCopies,
    });
    await newBook.save();
    res.status(201).json({ message: "Book added successfully", book: newBook });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

bookRouter.get("/books/views", async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
    const search = (req.query.search || "").trim();

    const filter = {};
    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escaped, "i");
      filter.$or = [{ title: regex }, { author: regex }];
    }

    const totalBooks = await Book.countDocuments(filter);
    const books = await Book.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      page,
      limit,
      totalBooks,
      totalPages: Math.ceil(totalBooks / limit) || 1,
      books,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

bookRouter.get("/books/:id", async (req, res) => {
  try {
    const bookId = req.params.id;
    console.log(bookId);
    const bookDetails = await Book.findById(bookId);
    if (!bookDetails) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json({ book: bookDetails });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

bookRouter.patch("/books/update/:id", async (req, res) => {
  try {
    const bookId = req.params.id;
    const bookToUpdate = await Book.findById(bookId);
    if (!bookToUpdate) {
      return res.status(404).json({ message: "Book not found" });
    }
    const allowedUpdates = ["title", "author", "totalCopies", "availableCopies"];
    const updates = Object.keys(req.body);

    const isValid = updates.every(field => allowedUpdates.includes(field));

    if (!isValid) {
      return res.status(400).json({ message: "Invalid updates!" });
    }
    Object.keys(req.body).forEach((field) => {
      bookToUpdate[field] = req.body[field];
    });

    await bookToUpdate.save();
    res.json({ message: "Book updated successfully", book: bookToUpdate });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

bookRouter.delete("/books/delete/:id", async (req, res) => {
    try {
    const bookId = req.params.id;

    // 1️⃣  book fetch 
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    // 2️⃣ Validation check 
    if (book.reservedCopies > 0) {
      return res.status(400).json({
        message: "Cannot delete book with active reservations",
      });
    }

    if (book.availableCopies < book.totalCopies) {
      return res.status(400).json({
        message: "Cannot delete book that is currently borrowed",
      });
    }

    // 3️⃣ Delete after validation
    await Book.findByIdAndDelete(bookId);

    res.status(200).json({
      message: "Book deleted successfully",
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
})
module.exports = bookRouter;
