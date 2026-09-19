import express from "express";

import {
  getArtworks,
  getArtworkById,
  createArtwork,
  updateArtwork,
  changeArtworkStatus,
  sellArtwork,
} from "../controllers/artworkController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getArtworks);

router.get("/:id", protect, getArtworkById);

router.post("/", protect, createArtwork);

router.put("/:id", protect, updateArtwork);

router.patch(
  "/:id/status",
  protect,
  changeArtworkStatus
);

router.patch(
  "/:id/sell",
  protect,
  sellArtwork
);

export default router;
