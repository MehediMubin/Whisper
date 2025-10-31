import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";

export const protectRoute = async (req, res, next) => {
   try {
      const token = req.headers?.token;
      if (!token) {
         return res
            .status(401)
            .json({ success: false, message: "No token provided" });
      }

      const { userId } = jwt.verify(token, process.env.JWT_SECRET);

      const user = await UserModel.findById(userId).select("-password");
      if (!user) {
         return res
            .status(404)
            .json({ success: false, message: "User not found" });
      }

      req.user = user;
      return next();
   } catch (error) {
      console.error(error.message);
      return res.status(401).json({ success: false, message: error.message });
   }
};
