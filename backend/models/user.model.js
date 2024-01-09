import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
{
   userName:{
       type:String,
       required:true
   },
   Email:{
         type:String,
         required:true,
   },
   Password:{
           type:String,
           required:true
   }
},
{
  timestamps:true
});

export const User = mongoose.model('User',userSchema);
