import express from "express";
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

dotenv.config();

const app = express();

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

// Health check
app.get("/health", (req, res) => {
  res.json({ success: true, message: "Server is running" });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
