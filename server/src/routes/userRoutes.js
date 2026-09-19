import express from "express";

import {
  loginUser,
  getUsers,
  getUserById,
  getCurrentUser,
  updateUser,
  deactivateUser,
} from "../controllers/userController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route
router.post("/login", loginUser);

// Protected routes
router.get("/", protect, getUsers);
router.get("/me", protect, getCurrentUser);
router.get("/:id", protect, getUserById);

router.put("/:id", protect, updateUser);

router.patch(
  "/:id/deactivate",
  protect,
  deactivateUser
);

export default router;
