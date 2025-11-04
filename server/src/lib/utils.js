import jwt from "jsonwebtoken";
import cloudinary from "./cloudinary.js";

export const generateToken = (userId) => {
   const token = jwt.sign({ userId }, process.env.JWT_SECRET);
   return token;
};

export const uploadImage = async (image) => {
   const uploadResponse = await cloudinary.uploader.upload(image);
   return uploadResponse.secure_url;
};
