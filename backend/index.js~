import express from "express";
import dotenv from "dotenv";
  dotenv.config();
import mongoose from "mongoose";
import { User } from "./models/user.model.js"
import bcrypt from "bcrypt";
import cors from 'cors';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { WebSocketServer } from 'ws';

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

  jwt.sign({ userId: user._id, userData: user  }, process.env.JWT_SECRET, { expiresIn: '1h' },(err,token) => {
             if (err) throw err;
             res.cookie('token',token,{sameSite:'none',secure:true}).status(201).json({
                  message:"user is registered!",
                  user,
                  _id:user._id,
                  token
             });
  });
 });

 app.post('/login',async(req,res) => {
   const { userName, Password } = req.body;

  if (!userName || !Password) {
        res.status(200).json({
           message:'All fields are required!'
        })
  }

  const user = await User.findOne({userName})
  if (!user) {
        res.status(400).json({
              message:"User not found!"
        })
  }

  const isMatch = await bcrypt.compare(Password,user.Password);

  if (!isMatch) {
        res.status(401).json({
              message:"User name or password is Incorrect!"
        })
  }

 jwt.sign({ userId: user._id, userData: user  }, process.env.JWT_SECRET, { expiresIn: '1h' },(err,token) => {
             if (err) throw err;
             res.cookie('token',token,{sameSite:'none',secure:true}).status(200).json({
                  message:"user loggedIn successfully!",
                  user,
                  _id:user._id,
                  token
             });
  });

  })

 app.get('/profile',(req,res) => {
      const token = req.cookies?.token;

   if (token) {
        jwt.verify(token,process.env.JWT_SECRET, {}, (err, userData) => {
                   if (err) throw err;

                 res.json(userData);
      });
   } else {
             res.status(200).json('no token!!');
   }
 });

const server = app.listen(PORT , () => console.log("Server is running on PORT:",PORT));

const wss = new WebSocketServer({server});

wss.on('connection',(connection,req) => {
  console.log('user is connected!');
  const cookies = req.headers.cookie;
  if (cookies) {
     const tokenCookieString = cookies.split(';').find(str => str.startsWith('token='));
     if (tokenCookieString) {
       const token = tokenCookieString.split('=')[1];
       if (token) {
            jwt.verify(token,process.env.JWT_SECRET, {},(err,user) => {
                if (err) throw err;
                const { userId, userData } = user;
                connection.userId = userId;
                connection.username = userData?.userName;
            });
       }
     }
  }

  console.log([...wss.clients].map(c => c.username));

  [...wss.clients].forEach(client => {
           client.send(JSON.stringify({
           online: [...wss.clients].map(c => ({userId:c.userId,username:c.username}))}))
           })
});




