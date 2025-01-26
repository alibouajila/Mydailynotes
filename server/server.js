const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

mongoose
  .connect("mongodb://localhost:27017/Mydailynotes") // Change the URL to your database URL connection
  .then(() => console.log("Connected to the database"))
  .catch((err) => {
    console.log(err);
  });

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  console.log("Success");
});

app.post("/register", async (req, res) => {
  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ status: "error", message: "Email already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create the new user
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    res.json({ status: "ok" });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ status: "error", message: "User not found" });
    }

    // Compare the password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ status: "error", message: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign({ userId: user._id, email: user.email }, "ali18", { expiresIn: "1h" });

    res.status(200).json({
      message: "Login successful!",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "An error occurred, please try again." });
  }
});

// Home page protected route (only for logged-in users)
app.get("/home", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Expecting "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - No token provided" });
  }

  jwt.verify(token, "ali18", (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized - Invalid or expired token" });
    }

    res.json({ message: "Welcome to the Home page", userId: decoded.userId });
  });
});

app.listen(3001, () => {
  console.log("Server is running ...");
});
