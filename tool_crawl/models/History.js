const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      enum: ["Crawl", "Validate"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("History", historySchema);
