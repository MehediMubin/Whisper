import express from "express";
import {
   checkAuth,
   login,
   signUp,
   updateProfile,
} from "../controllers/userController";
import { protectRoute } from "../middleware/auth";

const userRouter = express.Router();

userRouter.post("/signUp", signUp);
userRouter.post("/login", login);
userRouter.put("/update-profile", updateProfile);
userRouter.get("/check", protectRoute, checkAuth);

export default userRouter;
