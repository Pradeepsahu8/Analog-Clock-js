import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js"
import {getUsersForSidebar,getMessages,sendMessage} from "../controllers/message.controller.js"

const router = express.Router();

router.get("/user",protectRoute,getUsersForSidebar)

router.get("/:id",protectRoute,getMessages) //not tested
router.get("/send/:id",protectRoute,sendMessage) // not tested




export default router;