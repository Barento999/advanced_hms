import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import errorHandler from "./middlewares/errorHandler.js";
import { apiLimiter } from "./middlewares/rateLimiter.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Make io accessible to routes
app.set("io", io);

// Connect to database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Rate limiting
app.use("/api", apiLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/notifications", notificationRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ success: true, message: "Server is running" });
});

// Error handler
app.use(errorHandler);

// Socket.io connection handling
const userSockets = new Map(); // Store userId -> socketId mapping

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Register user
  socket.on("register", (userId) => {
    userSockets.set(userId, socket.id);
    socket.join(userId); // Join a room with userId
    console.log(`User ${userId} registered with socket ${socket.id}`);
  });

  // Disconnect
  socket.on("disconnect", () => {
    // Remove user from map
    for (const [userId, socketId] of userSockets.entries()) {
      if (socketId === socket.id) {
        userSockets.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});

// Make io and userSockets globally accessible
global.io = io;
global.userSockets = userSockets;

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
