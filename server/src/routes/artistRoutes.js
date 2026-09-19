import express from "express";

import {
  getArtists,
  getArtistById,
  createArtist,
  updateArtist,
} from "../controllers/artistController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getArtists);
router.get("/:id", protect, getArtistById);
router.post("/", protect, createArtist);
router.put("/:id", protect, updateArtist);

export default router;
