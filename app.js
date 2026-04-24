const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const connectDb = require('./config/database');
const passport = require('passport');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
require('dotenv').config();
require('./config/passport.js');

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const bookRouter = require('./routes/books');
const borrowRouter = require('./routes/borrow');
const reserveRouter = require('./routes/reserve');

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'], // Update with your frontend URL
    credentials: true, // Allow cookies to be sent
  }));

app.use(express.json())
app.use(cookieParser())
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your_session_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { 
      secure: false, 
      httpOnly: true, // Set to true if using HTTPS
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use('/',authRouter)
app.use('/',profileRouter)
app.use('/',bookRouter)
app.use('/',borrowRouter)
app.use('/',reserveRouter)

connectDb()
    .then(() => {
        console.log("server is established successfully");
        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
    })
    .catch((err) => {
        console.error("failed to start server due to database connection error", err);
        process.exit(1);
    });