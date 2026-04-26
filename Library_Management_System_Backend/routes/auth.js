const express = require("express");
const authRouter = express.Router();
const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

authRouter.post("/signup", async (req, res) => {
  try {
    const {
      name,
      username,
      email,
      password,
      stream,
      class: userClass,} = req.body;

    if (!name || !username || !email || !password || !stream || !userClass) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    // creating a new instant of user
    const newUser = new User({
      Name: name,
      UserName: username,
      emailId: email,
      password: hashedPassword,
      stream: stream,
      class: userClass,
    });
    await newUser.save();
    res.status(201).json({ message: "User signed up successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error occurred while signing up" });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email);
    const user = await User.findOne({ emailId: email });

    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT();
      console.log(token,"token-------");
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send({ message: "Login successful", token });
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send({ message: err.message});
  }
});

authRouter.post("/logout", (req, res) => {
    res.cookie("token",null, {
        expires: new Date(Date.now()),
    });
    res.send({message: "Logout successfully"});
});

// Google OAuth Routes
authRouter.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

authRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login?error=Google+login+failed",
  }),
  async (req, res) => {
    try {
      const token = await req.user.getJWT();
      // Redirect to frontend with the JWT token so React can save it locally
      res.redirect(`http://localhost:5173/dashboard?token=${token}`);
    } catch (err) {
      res.redirect(`http://localhost:5173/login?error=${encodeURIComponent(err.message)}`);
    }
  }
);


module.exports = authRouter;
