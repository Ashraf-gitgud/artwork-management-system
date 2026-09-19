import express from "express";

import {
  getDepositors,
  getDepositorById,
  createDepositor,
  updateDepositor,
} from "../controllers/depositorController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getDepositors);
router.get("/:id", protect, getDepositorById);
router.post("/", protect, createDepositor);
router.put("/:id", protect, updateDepositor);

export default router;
