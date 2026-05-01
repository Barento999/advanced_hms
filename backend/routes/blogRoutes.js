import express from "express";
import {
  getAllPosts,
  getPostById,
  getFeaturedPosts,
  createPost,
  updatePost,
  deletePost,
  getAdminPosts,
  getCategories,
} from "../controllers/blogController.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

// Public routes
router.get("/posts", getAllPosts);
router.get("/posts/:id", getPostById);
router.get("/featured", getFeaturedPosts);
router.get("/categories", getCategories);

// Admin routes (protected)
router.post("/posts", protect, authorize("admin"), createPost);
router.put("/posts/:id", protect, authorize("admin"), updatePost);
router.delete("/posts/:id", protect, authorize("admin"), deletePost);
router.get("/admin/posts", protect, authorize("admin"), getAdminPosts);

export default router;
