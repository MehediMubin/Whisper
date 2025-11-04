import { Schema, model } from "mongoose";

const userSchema = new Schema(
   {
      email: {
         type: String,
         required: true,
         unique: true,
      },
      fullName: {
         type: String,
         required: true,
      },
      password: {
         type: String,
         required: true,
         minLength: 6,
      },
      bio: {
         type: String,
      },
      profilePic: {
         type: String,
         default: "",
      },
   },
   {
      timestamps: true,
   }
);

const UserModel = model("User", userSchema);

export default UserModel;
