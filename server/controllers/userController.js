import UserModel from "../models/userModel.js";
import bcrypt from 'bcryptjs';

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
        fullName, email, password: hashedPassword, bio
      });

      
   } catch (error) {}
};
