const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    advertiser_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",

    },
    content: {
      text: {
        type: String,

      },
      label: {
        type: Boolean,
      },
    },
    process_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Process",

    },
    image: {
      url: {
        type: String,
      },
      label: {
        type: Boolean,
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
