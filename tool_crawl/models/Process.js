const mongoose = require("mongoose");

const processSchema = new mongoose.Schema(
  {
    statusDates: {
      Pending: {
        type: Date,
      },
      Reviewed: {
        type: Date,
      },
      Violation: {
        type: Date,
      },
      Resolved: {
        type: Date,
      },
    },
    currentStatus: {
      type: String,
      enum: ["Pending", "Reviewed", "Violation", "Resolved"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Process", processSchema);
