import mongoose from "mongoose";

const artworkSchema = new mongoose.Schema(
  {
    inventoryNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    artistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artist",
      default: null,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    creationDate: {
      type: Date,
      required: true,
    },

    medium: {
      type: String,
      required: true,
      trim: true,
    },

    technique: {
      type: String,
      trim: true,
    },

    material: {
      type: String,
      trim: true,
    },

    dimensions: {
      height: {
        type: Number,
        required: true,
      },
      width: {
        type: Number,
        required: true,
      },
      depth: {
        type: Number,
      },
      unit: {
        type: String,
        required: true,
        trim: true,
      },
    },

    signatureLocation: {
      type: String,
      trim: true,
    },

    creationCertificate: {
      type: Boolean,
      default: false,
    },

    imageUrl: {
      type: String,
      trim: true,
    },

    condition: {
      type: String,
      enum: ["excellent", "bon", "deteriore"],
      required: true,
    },

    status: {
      type: String,
      enum: [
        "for_sale",
        "for_auction",
        "for_exhibit",
        "in_storage",
        "being_restored",
        "sold",
        "returned",
        "missing",
      ],
      default: "in_storage",
    },

    depositorCin: {
      type: String,
      trim: true,
    },

    buyerCin: {
      type: String,
      trim: true,
      default: null,
    },

    inventoryDate: {
      type: Date,
      default: Date.now,
    },

    exitDate: {
      type: Date,
      default: null,
    },

    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Artwork = mongoose.model("Artwork", artworkSchema);

export default Artwork;