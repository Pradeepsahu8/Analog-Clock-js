import jwt from "jsonwebtoken";

export const generateJwtToken = (userId,res)=>{
    let token = jwt.sign({userId}, process.env.JWT_SECRET,{expiresIn:'7d'});
    
    res.cookie("jwtToken",token,{
        httpOnly:true,
        sameSite:"strict",
        maxAge:7*24*60*60*1000
    })
    return token;
}