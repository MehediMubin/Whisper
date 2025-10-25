// Get all users except the logged in user
export const getUsersForSidebar = async (req, res) => {
   try {
      const userId = req.user._id;
      const filteredUsers = await UserModel.find({
         _id: { $ne: userId },
      }).select("-password");

      // count number of messages not seen
      const unseenMessages = {};
      const promises = filteredUsers.map(async (user) => {
         const messages = await MessageModel.find({
            senderId: user._id,
            receiverId: userId,
            seen: false,
         });
         if (messages.length > 0) {
            unseenMessages[user._id] = messages.length;
         }
      });
      await Promise.all(promises);
      res.json({
         success: true,
         message: "Users fetched successfully",
         users: filteredUsers,
         unseenMessages,
      });
   } catch (error) {
      console.error(error.message);
      res.json({
         success: false,
         message: error.message,
      });
   }
};

// Get all messages for selected user
export const getMessages = async (req, res) => {
   try {
      const { id: selectedUserId } = req.params;
      const myId = req.user._id;

      const messages = await MessageModel.find({
         $or: [
            { senderId: myId, receiverId: selectedUserId },
            { senderId: selectedUserId, receiverId: myId },
         ],
      });

      await MessageModel.updateMany({
         senderId: selectedUserId,
         receiverId: myId,
         seen: true,
      });
      res.json({
         success: true,
         message: "Messages fetched successfully",
         messages,
      });
   } catch (error) {
      console.error(error.message);
      res.json({
         success: false,
         message: error.message,
      });
   }
};

// Mark message as seen using message id
export const markMessageAsSeen = async (req, res) => {
   try {
      const { id: messageId } = req.params;

      await MessageModel.findByIdAndUpdate(messageId, { seen: true });

      res.json({
         success: true,
         message: "Message marked as seen",
      });
   } catch (error) {
      console.error(error.message);
      res.json({
         success: false,
         message: error.message,
      });
   }
};

// Send message to selected user
export const sendMessage = async (req, res) => {
   try {
      const { text, image } = req.body;
      const senderId = req.user._id;
      const { id: receiverId } = req.params;

      let imageUrl;
      if (image) {
         imageUrl = await uploadImage(image);
      }

      const newMessage = await MessageModel.create({
         text,
         image: imageUrl,
         senderId,
         receiverId,
      });

      // Emit the new message to the receiver's socket
      const receiverSocketId = userSocketMap[receiverId];
      if (receiverSocketId) {
         io.to(receiverSocketId).emit("newMessage", newMessage);
      }

      res.json({
         success: true,
         message: "Message sent successfully",
         newMessage,
      });
   } catch (error) {
      console.error(error.message);
      res.json({
         success: false,
         message: error.message,
      });
   }
};
