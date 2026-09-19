import mongoose from "mongoose";

const artworkHistorySchema = new mongoose.Schema(
  {
    artworkId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artwork",
      required: true,
    },

    action: {
      type: String,
      enum: [
        "added",
        "status_changed",
        "sold",
        "returned",
        "sent_to_restoration",
        "restoration_completed",
        "marked_missing",
      ],
      required: true,
    },

    date: {
      type: Date,
      default: Date.now,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    userLastName: {
      type: String,
      required: true,
      trim: true,
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

const ArtworkHistory = mongoose.model(
  "ArtworkHistory",
  artworkHistorySchema
);

export default ArtworkHistory;