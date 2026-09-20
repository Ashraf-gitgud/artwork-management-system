import Artwork from "../models/Artwork.js";
import Artist from "../models/Artist.js";
import Category from "../models/Category.js";
import Depositor from "../models/Depositor.js";
import Buyer from "../models/Buyer.js";

const GALLERY_STATUSES = [
  "for_sale",
  "for_auction",
  "for_exhibit",
  "in_storage",
  "returned",
  "being_restored",
];

const BIN_STATUSES = [
  "sold",
  "missing",
];

export const getArtworks = async (req, res) => {
  try {
    const artworks = await Artwork.find()
      .populate("artistId")
      .populate("categoryId")
      .sort({ createdAt: -1 });

    res.json(artworks);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch artworks",
    });
  }
};

export const getArtworkById = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id)
      .populate("artistId")
      .populate("categoryId");

    if (!artwork) {
      return res.status(404).json({
        message: "Artwork not found",
      });
    }

    res.json(artwork);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch artwork",
    });
  }
};

export const createArtwork = async (req, res) => {
  try {
    const {
      artistId,
      categoryId,
      depositorCin,
    } = req.body;

    if (artistId) {
      const artist = await Artist.findById(artistId);

      if (!artist) {
        return res.status(400).json({
          message: "Artist not found",
        });
      }
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(400).json({
        message: "Category not found",
      });
    }

    if (depositorCin) {
      const depositor = await Depositor.findOne({
        cin: depositorCin,
      });

      if (!depositor) {
        return res.status(400).json({
          message: "Depositor not found",
        });
      }
    }

    const artwork = await Artwork.create({
      ...req.body,
      status: req.body.status || "in_storage",
      buyerCin: null,
      exitDate: null,
    });

    res.status(201).json(artwork);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const updateArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);

    if (!artwork) {
      return res.status(404).json({
        message: "Artwork not found",
      });
    }

    // Status changes must use the dedicated status endpoint.
    if (req.body.status !== undefined) {
      return res.status(400).json({
        message: "Use the status endpoint to change artwork status",
      });
    }

    // Buyer changes must use the dedicated sell endpoint.
    if (req.body.buyerCin !== undefined) {
      return res.status(400).json({
        message: "Use the sell endpoint to assign a buyer",
      });
    }

    // exitDate is controlled by status transitions.
    if (req.body.exitDate !== undefined) {
      return res.status(400).json({
        message: "exitDate is managed automatically",
      });
    }

    const allowedFields = [
      "title",
      "artistId",
      "categoryId",
      "creationDate",
      "medium",
      "technique",
      "material",
      "dimensions",
      "signatureLocation",
      "creationCertificate",
      "imageUrl",
      "condition",
      "depositorCin",
      "notes",
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        artwork[field] = req.body[field];
      }
    }

    if (req.body.artistId !== undefined && req.body.artistId !== null) {
      const artist = await Artist.findById(req.body.artistId);

      if (!artist) {
        return res.status(400).json({
          message: "Artist not found",
        });
      }
    }

    if (req.body.categoryId !== undefined) {
      const category = await Category.findById(
        req.body.categoryId
      );

      if (!category) {
        return res.status(400).json({
          message: "Category not found",
        });
      }
    }

    if (req.body.depositorCin !== undefined) {
      if (req.body.depositorCin) {
        const depositor = await Depositor.findOne({
          cin: req.body.depositorCin,
        });

        if (!depositor) {
          return res.status(400).json({
            message: "Depositor not found",
          });
        }
      }
    }

    await artwork.save();

    res.json(artwork);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const changeArtworkStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;

    if (
      ![
        ...GALLERY_STATUSES,
        ...BIN_STATUSES,
      ].includes(status)
    ) {
      return res.status(400).json({
        message: "Invalid artwork status",
      });
    }

    const artwork = await Artwork.findById(req.params.id);

    if (!artwork) {
      return res.status(404).json({
        message: "Artwork not found",
      });
    }

    const previousStatus = artwork.status;

    if (previousStatus === status) {
      return res.status(400).json({
        message: "Artwork already has this status",
      });
    }

    artwork.status = status;

    if (BIN_STATUSES.includes(status)) {
      artwork.exitDate = new Date();
    } else {
      artwork.exitDate = null;
    }

    if (status === "returned") {
    artwork.buyerCin = null;
    }

    await artwork.save();

    let action = "status_changed";

    if (
      previousStatus !== "being_restored" &&
      status === "being_restored"
    ) {
      action = "sent_to_restoration";
    } else if (
      previousStatus === "being_restored" &&
      status !== "being_restored"
    ) {
      action = "restoration_completed";
    } else if (status === "returned") {
      action = "returned";
    } else if (status === "missing") {
      action = "marked_missing";
    }

    res.json(artwork);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const sellArtwork = async (req, res) => {
  try {
    const { buyerCin, notes } = req.body;

    if (!buyerCin) {
      return res.status(400).json({
        message: "buyerCin is required",
      });
    }

    const artwork = await Artwork.findById(req.params.id);

    if (!artwork) {
      return res.status(404).json({
        message: "Artwork not found",
      });
    }

    if (BIN_STATUSES.includes(artwork.status)) {
      return res.status(400).json({
        message: "Artwork is already in the bin",
      });
    }

    const buyer = await Buyer.findOne({
      cin: buyerCin,
    });

    if (!buyer) {
      return res.status(400).json({
        message: "Buyer not found",
      });
    }

    artwork.buyerCin = buyerCin;
    artwork.status = "sold";
    artwork.exitDate = new Date();

    await artwork.save();


    res.json(artwork);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
