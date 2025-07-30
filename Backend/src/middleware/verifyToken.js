import jwt from "jsonwebtoken";

export const verifyToken= async (req,res,next)=>{

    let token =req.cookies.jwtToken; //the name token will be same as you have saved insode res.cookies("token",jwttoken)
    try {

        console.log("verifiy token method called ");
        
        if (!token)
        {
            res.status(401).json({message:"Unauthorized - Token not provided"})
        }


        let decodedToken = jwt.verify(token , process.env.JWT_SECRET);

        
        if(!decodedToken)
        {
            return res.status(401).json({message:"Unauthorized - Invalid Token"});
        }

        
        req.userId= decodedToken.userId;
        next();


        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal Server Error - Token verification failed"});
        
    }
}