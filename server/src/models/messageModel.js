import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
   {
      senderId: {
         type: Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },
      receiverId: {
         type: Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },
      text: {
         type: String,
      },
      image: {
         type: String,
      },
      seen: {
         type: Boolean,
         default: false,
      },
   },
   {
      timestamps: true,
   }
);
// Store Message documents in the shared 'whisper' collection
const MessageModel = mongoose.model("Message", messageSchema);
export default MessageModel;
