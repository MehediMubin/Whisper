import express from "express";
import {
   getMessages,
   getUsersForSidebar,
   sendMessage,
} from "../controllers/messageController";
import { protectRoute } from "../middleware/auth";

const messageRouter = express.Router();

messageRouter.get("/users", protectRoute, getUsersForSidebar);
messageRouter.get("/:id", protectRoute, getMessages);
messageRouter.put("/mark/:id", protectRoute, markMessagesAsSeen);
messageRouter.post("/send/:id", protectRoute, sendMessage);

export default messageRouter;
