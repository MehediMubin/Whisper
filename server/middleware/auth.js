import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";

export const protectRoute = async (req, res, next) => {
   try {
      const token = req.headers.token;
      const { userId } = jwt.verify(token, process.env.JWT_SECRET);

      const user = UserModel.findById(userId).select("-password");
      if (!user) {
         res.json({
            success: false,
            message: "User not found",
         });
      }

      req.user = user;
      next();
   } catch (error) {
      console.error(error.message);
      res.json({
         success: false,
         message: error.message,
      });
   }
};
