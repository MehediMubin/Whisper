import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import UserModel from "../models/userModel.js";

export const signUp = async (req, res) => {
   const { fullName, email, password, bio } = req.body;
   try {
      if (!fullName || !email || !password || !bio) {
         return res.json({
            success: false,
            message: "Please provide valid information",
         });
      }
      const user = await UserModel.findOne({ email });
      if (user) {
         return res.json({
            success: false,
            message: "Account already exists!",
         });
      }

      const salt = await bcrypt.getSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await UserModel.create({
         fullName,
         email,
         password: hashedPassword,
         bio,
      });

      const token = generateToken(newUser._id);
      res.json({
         success: true,
         message: "Account created successfully",
         userData: newUser,
         token,
      });
   } catch (error) {
      console.error(error.message);
      res.json({
         success: false,
         message: error.message,
      });
   }
};

export const login = async (req, res) => {
   try {
      const { email, password } = req.body;
      const userData = UserModel.findOne({ email });

      const isPasswordCorrect = await bcrypt.compare(
         password,
         userData.password
      );

      if (!isPasswordCorrect) {
         res.json({
            success: false,
            message: "Invalid credentials",
         });
      }

      const token = generateToken(userData._id);
      res.json({
         success: true,
         message: "Login successful",
         userData,
         token,
      });
   } catch (error) {
      console.error(error.message);
      res.json({
         success: false,
         message: error.message,
      });
   }
};
