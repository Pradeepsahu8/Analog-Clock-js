import mongoose from "mongoose";

let userSchema = new mongoose.Schema({
    email:{
        type:String, 
        required:true, 
        unique:true
    },
    fullName:{
        type:String,
        required:true
    },

    password:{
        type:String,
        required:true,
        minlength:6
   },

   //cahnges could be made cahnges the data type to blob
   profilePic:{
    type:String,
    default:""
   }
},

{timestamps:true}

)

const User=mongoose.model("User",userSchema);

export default User;