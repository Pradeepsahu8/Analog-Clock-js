import User from "../model/user.model.js"
import brcrypt from "bcrypt"
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

export const signup= async (req,res)=>{
    const {fullName , email, password }=req.body;
    try {

        if(!fullName || !email || !password)
        {
           return res.status(400).json({message:"All filed are required "})
   
        }
        if(password.length<6)
        {
            return res.status(400).json({message:"Password Should be more than 6 character "})
        }

        let user =await User.findOne({email});
        if(user)
        {   
            return res.status(400).json({message:"User with email "+email+ "alreday exists"});

        }

        const salt= await brcrypt.genSalt(10);
        const hashedPassword = await brcrypt.hash( password, salt);

        let newUser= new User({  email:email,fullName:fullName , password:hashedPassword});
       
        

        if(newUser)
        {
                generateToken(newUser._id,res);
                let data = await newUser.save();
                res.status(201).json({
                    _id: newUser._id,
                    fullName: newUser.fullName,
                    email: newUser.email,
                    profilePic: newUser.profilePic
                })
        }else{
                 return res.status(400).json({message:"Invalid user data "})

        }
        
    } catch (error) {
        console.log(error);
        
        
         return res.status(500).json({message:"Internal Server Error"});

    }
}





export const login=async (req,res)=>{
   const { email , password }= req.body;
    
    try {

         if(!email || !password)
        {
           return res.status(400).json({message:"All filed are required "})
   
        }
        if(password.length<6)
        {
            return res.status(400).json({message:"Password Should be more than 6 character "})
        }

        let user = await User.findOne({email:email});
        if(!user)
        {
          return res.status(400).json({message:"Invalid Credentails"});

        }
        const isPasswordCorrect=await brcrypt.compare(password,user.password);
            if(!isPasswordCorrect)
            {
              return res.status(400).json({message:"Invalid Credentails"});
   
            }
            generateToken(user._id, res);
            res.status(200).json({

                    _id:  user._id,
                    fullName:  user.fullName,
                    email:  user.email,
                    profilePic:  user.profilePic
            })

    } catch (error) {

        console.log(error);
         return res.status(500).json({message:"Internal Server Error"});


    }
}



export const logout= async (req,res)=>{
    try{

        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:"You are successfully logout"})
    }
    catch(error)
    {
        
        console.log(error);
         return res.status(500).json({message:"Internal Server Error"});

    }


} 

export const updateProfile=async(req,res)=>{
    try{
console.log("profile function run ");


        let { profilePic } = req.body;
        let userId = req.user._id;
        if(!userId)
        {
             return res.status(401).json({message:"Not authonticated"});

        }
        if(!profilePic)
        {
            return res.status(400).json({message:"Profile Pic is Required"});
        }


        let uploadResponse=await cloudinary.uploader.upload(profilePic);

        
        
        if(!uploadResponse)
        {
          return res.status(400).json({message:"Problem in uploading the photo"});

        }

       const updatedUser= await User.findByIdAndUpdate(userId, {profilePic:uploadResponse.secure_url},{new:true})

         return res.status(200).json({updatedUser});



    }catch(error)
    {
        console.log("error in update profile ", error);
         return res.status(500).json({message:"Internal Server Error"});

        
    }

}


export const checkAuth= async(req,res)=>{

    try {

         const user = req.user.toObject(); // ✅ Remove Mongoose internals
        delete user.password; // 🔒 Hide password if not already excluded
        return res.status(200).json(user);

    } catch (error) {
     
        console.log("Error in checking the authcontroller { 🥶 contoller 🥶}" ,error);
         return res.status(500).json({message:"Internal Server Error"});
       
        
    }

}