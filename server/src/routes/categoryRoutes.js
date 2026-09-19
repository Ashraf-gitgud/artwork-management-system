import express from "express";

import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
} from "../controllers/categoryController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getCategories);
router.get("/:id", protect, getCategoryById);
router.post("/", protect, createCategory);
router.put("/:id", protect, updateCategory);

export default router;
