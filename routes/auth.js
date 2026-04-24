const express = require("express");
const authRouter = express.Router();
const User = require("../model/user");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const jwt = require("jsonwebtoken");

// STEP 1: Google login
authRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// STEP 2: Google callback
authRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    try {
      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not set in environment variables");
      }

      // Create token properly
      const token = jwt.sign(
        { id: req.user._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      console.log("Token created:", token);

      // Redirect to frontend with token
      res.redirect(`http://localhost:5173/dashboard?token=${token}`);
    } catch (err) {
      console.error("Google callback error:", err);
      res.redirect(`http://localhost:5173/signup?error=${encodeURIComponent(err.message)}`);
    }
  }
);

authRouter.post("/signup", async (req, res) => {
  try {
    const {
      name,
      username,
      email,
      password,
      stream,
      class: userClass,
    } = req.body;

    // Only require name, username, email, password
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "Name, username, email, and password are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    const newUser = new User({
      Name: name,
      UserName: username,
      emailId: email,
      password: hashedPassword,
      stream: stream || "",
      class: userClass || "",
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
    const user = await User.findOne({ emailId: email   });

    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT();
      console.log(token, "token-------");
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send({ message: "Login successful", token });
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send({ message: "Logout successfully" });
});

module.exports = authRouter;