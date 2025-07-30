import e from "express";
import {login,signup,verifyEmail,logout,forgotPassword,resetPassword,checkAuth} from "../controllers/auth.controller.js"
import { verifyToken } from "../middleware/verifyToken.js";
let router= e.Router();



router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/verify-email", verifyEmail); // sending verfication OTP after signup
router.post("/forgot-password", forgotPassword); //This will only check if the user who had clicked on the forgot Password button exit or not if yes then it will send the email of reset password with the restToken embedded in the mail whicj will take you to rest password to page 
router.post("/reset-password/:token", resetPassword);

router.get("/check-auth", verifyToken, checkAuth);

export default router;
