import express from "express";

import {
  getArtworkHistory,
} from "../controllers/artworkHistoryController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/artwork/:artworkId",
  protect,
  getArtworkHistory
);

export default router;
