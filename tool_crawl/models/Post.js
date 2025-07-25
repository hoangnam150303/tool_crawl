const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    advertiser_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      text: {
        type: String,
        required: true,
      },
      label: {
        type: String,
        enum: ["Intent", "Sentiment", "Violation"],
      },
    },
    process_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Process",
      required: true,
    },
    image: {
      url: {
        type: String,
      },
      label: {
        type: String,
      enum: ["Icon", "Restriced_Object", "Content"],
      },
    },
    reviewed_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", postSchema);
