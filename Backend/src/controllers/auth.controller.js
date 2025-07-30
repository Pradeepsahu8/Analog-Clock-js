import connectDB from "../lib/db.js";
import { User } from "../model/user.model.js";
import brcrypt from "bcrypt";
import { generateJwtToken } from "../lib/jwtutils.js";
import { sendEmail , sendWelcomeEmail, sendResetPasswordEmail,sendResetPasswordSuccessEmail } from "../lib/mail.js";
import crypto from "crypto";






export const login=async(req,res)=>{
    const {email , password}=req.body;
    try {
    
        if(!email || !password)
        {
            return res.status(400).json({message:"All fields are required "});
        }
        let isUserExists =  await User.findOne({email:email});
        if(!isUserExists)
        {
            return res.status(400).json({message:"User with email "+email+ " does not exists"});
        }

        let isPasswordMatch = await brcrypt.compare(password,isUserExists.password);
        if(!isPasswordMatch)
        {
            return res.status(400).json({message:"Invalid Password"});
        }

        generateJwtToken(isUserExists._id,res);
        

        
        isUserExists.lastLogin = new Date();
        let newUser = await isUserExists.save({new:true});
        return res.status(200).json({message:"Login Successfully", user:{ ...newUser._doc,password:undefined}});




    } catch (error) {
        console.log(error); 
        
        return res.status(500).json({message:error.message});
    }
}

export const signup=async(req,res)=>{
    let {email ,password, name}=req.body;
    try {
       if(!name || !email || !password)
        {
           return res.status(400).json({message:"All filed are required "})
   
        }

         if(password.length<6)
        {
            return res.status(400).json({message:"Password Should be more than 6 character "})
        }

        let userExists =await User.findOne({email});
        if(userExists)
        {   
            return res.status(400).json({message:"User with email "+email+ "alreday exists"});

        }

        const salt= await brcrypt.genSalt(10);
        const hashedPassword = await brcrypt.hash( password, salt);



            let verificationCode = Math.floor(100000 + Math.random()*900000).toString();

            let newUser = new User({ 
                email:email,
                name:name,
                password:hashedPassword,
                verificationToken:verificationCode,
                verificationTokenExpiresAt:Date.now()+24*60*60*1000
            });
                 
            if(newUser)
            {
                let data = await newUser.save();
                generateJwtToken(newUser._id,res);

                sendEmail(newUser.email,verificationCode);
                
                  res.status(201).json({
                    status:true,
                    user:{
                       ...newUser._doc,
                       password:undefined
                    }
                })

            }else{
                 return res.status(400).json({message:"Invalid user data "});
                 }
    } catch (error) {
                 return res.status(500).json({message:error.message});
   
    }
}

export const verifyEmail=async (req,res)=>{

    let {code}= req.body;
        try {

            let  user = await User.findOne({
                verificationToken:code,
                verificationTokenExpiresAt: {$gt:Date.now()}
            })

            if(!user)
            {
                res.status(400).json({success:false, message:"Verification Token Invalid or Expired"});

            }
            user.isVerified = true;
            user.verificationToken=undefined;
            user.verificationTokenExpiresAt=undefined;

             await user.save({new:true});
            

            sendWelcomeEmail(user.email,user.name);
            return res.status(200).json({success:true, message:"Email Verified Successfully", user:{
                ...user._doc,
                password:undefined,
            }});

        } catch (error) {
            console.log(error);
            
            return res.status(500).json({success:false, message:error.message});

        }
}

export const logout=async( req,res)=>{

    try {
        
        res.clearCookie("jwtToken");
        return res.status(200).json({success:true, message:"Logout Successfully"});

    } catch (error) {
        console.log(error);
        
        return res.status(500).json({success:false, message:error.message});
    }
}

export const forgotPassword = async (req,res)=>{
    let {email} =req.body;
    try {
        let user = await User.findOne({email});
        if(!user)
        {
            return res.status(400).json({message:"User with email "+email+ " does not exists"});
        }
        let resetToken = crypto.randomBytes(20).toString("hex");
        let tokenExpiresAt = Date.now()+60*60*1000; 

        user.resetPasswordToken=resetToken,
        user.resetPasswordTokenExpiresAt=tokenExpiresAt;

        await user.save({new:true});

        sendResetPasswordEmail(user.email,`http://localhost:5173/reset-password/${resetToken}`);
        
        return res.status(200).json({message:"Reset Password Email Sent Successfully"});

    } catch (error) {
        console.log(error);
        return res.status(500).json({message:error.message});
        
    }
}

export const resetPassword= async(req,res)=>{
    try {
        let {token}= req.params;
        let {password }=req.body;

        let user = await User.findOne({
               resetPasswordToken:token,
                resetPasswordTokenExpiresAt: {$gt:Date.now()}

           })
           if(!user)
           {
            return res.status(400).json({status:false,message:" invalid or Token has Expires"})
           }

           let salt = await brcrypt.genSalt(10);
           const hashedPassword = await brcrypt.hash( password, salt);

           user.password=hashedPassword;
           user.resetPasswordToken=undefined;
           user.resetPasswordTokenExpiresAt=undefined;
           await user.save({new:true});

            sendResetPasswordSuccessEmail(user.email)
          
              return res.status(200).json({message:"Password Reset Successfully"});



    } catch (error) {
        console.log(error);
       return res.status(500).json({message:error.message});    
        
    }

}

export const checkAuth=async (req,res)=>{
   try{

    let id = req.userId;
    let user = await User.findById(id);
    console.log(user);
    
    if(!user)
    {
        return res.status(400).json({status:false, message:"User Not Found"});
    }

    return res.status(200).json({user:{
        ...user._doc,
        password:undefined
    }})
   }catch(error)
   {
    console.log(error);
       return res.status(500).json({message:error.message});    
        
        
   }
}