const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    ai_detection_log: {
      content_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
      },
      input_text: {
        type: String,
      },
      image_url: {
        type: String,
      },
      violation_detected: {
        type: Boolean,
      },
      violation_codes: [
        {
          type: String,
        },
      ],
      confidence_score:{
        type: Number
      }
    },
    moderator_log:{
      moderator_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      content_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
      },
      is_violation: {
        type: Boolean,
      },
      note:{
        type: String
      }
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Log", logSchema);
