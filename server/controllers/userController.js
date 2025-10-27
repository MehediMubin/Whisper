import bcrypt from "bcryptjs";
import { generateToken, uploadImage } from "../lib/utils.js";
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

      const salt = await bcrypt.genSalt(10);
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
      const userData = await UserModel.findOne({ email });

      if (!userData) {
         return res.json({ success: false, message: "Invalid credentials" });
      }

      const isPasswordCorrect = await bcrypt.compare(
         password,
         userData.password
      );
      if (!isPasswordCorrect) {
         return res.json({ success: false, message: "Invalid credentials" });
      }

      const token = generateToken(userData._id);
      res.json({ success: true, message: "Login successful", userData, token });
   } catch (error) {
      console.error(error.message);
      res.json({
         success: false,
         message: error.message,
      });
   }
};

// controller to check if user is authenticated
export const checkAuth = (req, res) => {
   res.json({
      success: true,
      user: req.user,
   });
};

// controller to update user profile details
export const updateProfile = async (req, res) => {
   try {
      const { fullName, bio, profilePic } = req.body;

      const userId = req.user._id;
      let updatedUser;

      if (!profilePic) {
         updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { bio, fullName },
            { new: true }
         );
      } else {
         const imageUrl = await uploadImage(profilePic);
         updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { fullName, bio, profilePic: imageUrl },
            { new: true }
         );
      }
      res.json({
         success: true,
         message: "Profile updated successfully",
         user: updatedUser,
      });
   } catch (error) {
      console.error(error.message);
      res.json({
         success: false,
         message: error.message,
      });
   }
};
