const express = require('express');
const cookieParser = require('cookie-parser');
const connectDb = require('./config/database');
const app = express();



const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const bookRouter = require('./routes/books');
const borrowRouter = require('./routes/borrow');
const reserveRouter = require('./routes/reserve');

app.use(express.json())
app.use(cookieParser())

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