const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');

require("dotenv").config()
const app = express();

connectDB();
app.use(cookieParser())

app.use(cors({
  origin: "https://cybershield-backend-seven.vercel.app/",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

const authRoutes = require("./routes/authRoutes")
const logRoutes = require("./routes/logRoutes")
const userRoutes = require("./routes/userRoutes")
const mapRoutes = require("./routes/mapRoutes")
app.use("/api/auth", authRoutes)
app.use("/api/logs", logRoutes)
app.use("/api/users", userRoutes)
app.use("/api/maps", mapRoutes)
app.get('/', (req , res)=>{
    res.send('hello world');
})

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});


