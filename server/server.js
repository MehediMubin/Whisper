import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { connectDB } from "./src/lib/db.js";

// Create HTTP server from the Express app
const server = http.createServer(app);

// Initialize Socket.IO server
const io = new Server(server, {
   cors: {
      origin: "*",
   },
});

// Store online users
export const userSocketMap = {}; // { userId: socketId }

// Socket.io connection handling
io.on("connection", (socket) => {
   const userId = socket.handshake.query.userId;
   console.log("User Connected", userId);

   if (userId) {
      userSocketMap[userId] = socket.id;
   }

   // Emit online users to all connected clients
   io.emit("getOnlineUsers", Object.keys(userSocketMap));

   socket.on("disconnect", () => {
      console.log("User Disconnected", userId);
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
   });
});

// Connect DB & start server
await connectDB();

if (process.env.NODE_ENV !== "production") {
   const PORT = process.env.PORT || 5000;
   server.listen(PORT, () => {
      console.log(`Server is running on PORT: ${PORT}`);
   });
}

// Export server for Vercel deployment
export default server;
