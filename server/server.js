const express =require("express")
const mongoose = require("mongoose")
const User =require("./models/user")
const cors=require("cors")
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



app.listen(3001,()=>{
    console.log("Server is running ...")
})