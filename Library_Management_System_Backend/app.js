require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('./config/passport');
const connectDb = require('./config/database');
const authRouter = require('./routes/auth');
const bookRouter = require('./routes/books');
const borrowRouter = require('./routes/borrow');
const profileRouter = require('./routes/profile');
const reserveRouter = require('./routes/reserve');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.session_secret || 'LibraryManagementSystemSecretKey',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  }),
);
app.use(passport.initialize());
app.use(passport.session());

app.use(authRouter);
app.use(bookRouter);
app.use(borrowRouter);
app.use(profileRouter);
app.use(reserveRouter);

app.get('/', (req, res) => {
  res.send('Library Management System Backend is running');
});

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  });
