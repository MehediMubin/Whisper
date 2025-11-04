import cors from "cors";
import express from "express";
import morgan from "morgan";
import messageRouter from "./src/routes/messageRoutes.js";
import userRouter from "./src/routes/userRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: "4mb" }));

// Routes
app.use("/api/status", (req, res) => {
   res.send("Server is live");
});
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

export default app;
