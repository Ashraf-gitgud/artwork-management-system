import Artwork from "../models/Artwork.js";
import ArtworkHistory from "../models/ArtworkHistory.js";

export const getArtworkHistory = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.artworkId);

    if (!artwork) {
      return res.status(404).json({
        message: "Artwork not found",
      });
    }

    const history = await ArtworkHistory.find({
      artworkId: req.params.artworkId,
    })
      .populate("userId", "firstName lastName username")
      .sort({ date: -1 });

    res.json(history);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch artwork history",
    });
  }
};
