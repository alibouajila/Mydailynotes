const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user");
const Note = require("./models/note");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middlewares/authMiddleware"); // Import auth middleware

mongoose
  .connect("mongodb://localhost:27017/Mydailynotes")
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.log(err));

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  console.log("Success");
});

// Register route
app.post("/register", async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ status: "error", message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
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

// Login route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ status: "error", message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ status: "error", message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, "ali18", { expiresIn: "1h" });
    const refreshToken = jwt.sign({ userId: user._id }, "aliali18a", { expiresIn: "7d" });

    res.cookie("refreshToken", refreshToken, { 
      httpOnly: true, 
      secure: false, // Set to true in production (HTTPS required)
      sameSite: "Strict" 
    });

    res.status(200).json({
      message: "Login successful!",
      token,
      name: user.name
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "An error occurred, please try again." });
  }
});

// Refresh token route
app.post("/refresh-token", (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "Unauthorized - No refresh token" });
  }

  jwt.verify(refreshToken, "aliali18a", (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized - Invalid refresh token" });
    }

    const newAccessToken = jwt.sign({ userId: decoded.userId }, "ali18", { expiresIn: "1h" });

    res.status(200).json({ token: newAccessToken });
  });
});

// Home page (Protected)
app.get("/home", authMiddleware, (req, res) => {
  res.json({ message: "Welcome to the Home page", userId: req.user.userId });
});

// Create a note (Protected)
app.post("/notes", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newNote = new Note({
      title: req.body.title,
      content: req.body.content,
      user: user._id,
    });

    await newNote.save();
    user.notes.push(newNote._id);
    await user.save();

    res.status(200).json({ message: "Note added successfully", note: newNote });
  } catch (error) {
    res.status(500).json({ message: "Failed to add note", error });
  }
});

// Get all notes (Protected)
app.get("/notes", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate("notes");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ notes: user.notes, username: user.name });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve notes", error });
  }
});

// Delete a note (Protected)
app.delete("/notes/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Attempting to delete note with ID:", req.params.id);

    const noteIndex = user.notes.findIndex((note) => note.toString() === req.params.id);

    if (noteIndex === -1) {
      return res.status(404).json({ message: "Note not found" });
    }

    user.notes.splice(noteIndex, 1);
    await Note.findByIdAndDelete(req.params.id);
    await user.save();

    console.log(`Note with ID ${req.params.id} deleted`);
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ message: "Failed to delete note", error });
  }
});

// Logout route
app.post("/logout", (req, res) => {
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out successfully" });
});

app.listen(3001, () => {
  console.log("Server is running ...");
});
