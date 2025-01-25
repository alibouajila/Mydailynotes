const express =require("express")
const mongoose = require("mongoose")
const User =require("./models/user")
const cors=require("cors")
const bcrypt=require ('bcrypt')
const jwt =require('jsonwebtoken')
mongoose
.connect("mongodb://localhost:27017/Mydailynotes")// change the url to your database url connection
.then(()=>console.log("connected to the database"))
.catch((err)=>{console.log(err)});
const app=express()
app.use(cors())
app.use(express.json())
app.get("/",(req,res)=>{
    console.log("sucess")
})
app.post("/register", async (req, res) => {
    try {
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
  
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        "ali18", 
        { expiresIn: "1h" } 
      );
  
      res.status(200).json({
        message: "Login successful!",
        token,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "error", message: "An error occurred, please try again." });
    }
  });



app.listen(3001,()=>{
    console.log("Server is running ...")
})