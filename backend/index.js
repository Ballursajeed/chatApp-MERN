import express from "express";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { User } from "./models/user.model.js"
import bcrypt from "bcrypt";
import cors from 'cors';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(
  cors({
  	credentials:true,
    origin: 'http://localhost:3000',
    methods:['GET','POST','PUT','DELETE']
  })
);

 app.use(express.json());
app.use(cookieParser());

const connectDB = async() => {
try {
 const MongoDB = await mongoose.connect(process.env.MONGO_URL)
 console.log("mongoDB connected!! on host:",MongoDB.connection.host);
 }
 catch (err) {
   console.log("Error while mongoDB connection!!");
   throw new Error("MongoDB connection error:", err)
 }
}

 //mongoDB connection
 connectDB();

 app.post('/register',async(req,res) => {

   const { userName,Email,Password } = req.body;

   if (!userName || !Email || !Password) {
          res.status(200).json({
               message:"All fields are required!"
          })
   }

   const existingUser = await User.findOne({ Email });
   if (existingUser) {
            res.status(200).json({
                  message:"User is already exist"
            })
            throw new Error("User is already exist!")
   }

     const hashedPassword = await bcrypt.hash(Password,10);

  //storing in DataBase
  const user = await User.create({
        userName,
        Email,
        Password: hashedPassword,
  });

  jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' },(err,token) => {
             if (err) throw err;
             res.cookie('token',token).status(201).json({
                  message:"user is registered!",
                  user,
                  _id:user._id,
                  token
             });
  });
 });

app.listen(PORT , () => console.log("Server is running on PORT:",PORT));