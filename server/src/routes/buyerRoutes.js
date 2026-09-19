import express from "express";

import {
  getBuyers,
  getBuyerById,
  createBuyer,
  updateBuyer,
} from "../controllers/buyerController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getBuyers);
router.get("/:id", protect, getBuyerById);
router.post("/", protect, createBuyer);
router.put("/:id", protect, updateBuyer);

export default router;
