import cors from "cors";
import "dotenv/config";
import express from "express";
import http from "http";
import { connectDB } from "./lib/db.js";
import messageRouter from "./routes/messageRoutes.js";
import userRouter from "./routes/userRoutes.js";

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Initialize socket.io server
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

// Middleware setup
app.use(cors());
app.use(express.json({ limit: "4mb" }));

// Routes setup
app.use("/api/status", (req, res) => {
   res.send("Server is live");
});
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Connect DB & Start server
await connectDB();
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
   console.log(`Server is running on PORT: ${PORT}`);
});

// do stuff