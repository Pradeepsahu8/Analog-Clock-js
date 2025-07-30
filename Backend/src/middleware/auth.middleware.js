import jwt from "jsonwebtoken"
import User from "../model/user.model.js"
import cookieParser from "cookie-parser";

export const protectRoute = async (req,res,next)=>{
    try {
        
        let token =req.cookies.jwt;
        if(!token)
        {
            return res.status(401).json({message:"You must be login to access this service"});

        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        //decode have payload called userid
                 

        if(!decoded)
        {
            return res.status(401).json({message:"Unauthorized - Invalid Token"});

        }

        const user1 = await User.findById(decoded.userId).select("-password");

        if(!user1)
        {
            return res.status(404).json({message:"User not Found "});

        }

        req.user=user1;

        next();

    } catch (error) {
        console.log("Error in middleWare Ⓜ️ ");
        console.log(error);
    }
}