const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user");
const Note = require("./models/note"); // Import the Note model
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
  const token = req.headers.authorization?.split(" ")[1];

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

// Create a note route
app.post("/notes", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - No token provided" });
  }

  jwt.verify(token, "ali18", async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized - Invalid or expired token" });
    }

    try {
      const user = await User.findById(decoded.userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Create a new note using the Note model
      const newNote = new Note({
        title: req.body.title,
        content: req.body.content,
        user: user._id, // Associate the note with the user
      });

      // Save the note to the database
      await newNote.save();

      // Push the newly created note to the user's notes array
      user.notes.push(newNote._id);
      await user.save();

      // Return the note with _id
      res.status(200).json({ message: "Note added successfully", note: newNote });
    } catch (error) {
      res.status(500).json({ message: "Failed to add note", error });
    }
  });
});

// Get all notes route
app.get("/notes", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - No token provided" });
  }

  jwt.verify(token, "ali18", async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized - Invalid or expired token" });
    }

    try {
      const user = await User.findById(decoded.userId).populate("notes"); // Populate notes with their data

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ notes: user.notes });
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve notes", error });
    }
  });
});

// Delete note route
app.delete("/notes/:id", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - No token provided" });
  }

  jwt.verify(token, "ali18", async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized - Invalid or expired token" });
    }

    try {
      const user = await User.findById(decoded.userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      console.log("Attempting to delete note with ID:", req.params.id); // Log the note ID

      const noteIndex = user.notes.findIndex((note) => note.toString() === req.params.id); // Ensure toString() for comparison

      if (noteIndex === -1) {
        return res.status(404).json({ message: "Note not found" });
      }
      user.notes.splice(noteIndex, 1);
     await Note.findByIdAndDelete(req.params.id)
     await user.save();

      console.log(`Note with ID ${req.params.id} deleted`);

      res.status(200).json({ message: "Note deleted successfully" });
    } catch (error) {
      console.error("Error deleting note:", error);
      res.status(500).json({ message: "Failed to delete note", error });
    }
  });
});

app.listen(3001, () => {
  console.log("Server is running ...");
});
