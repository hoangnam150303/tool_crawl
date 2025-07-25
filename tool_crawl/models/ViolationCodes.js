const mongoose = require("mongoose");

const codesSchema = new mongoose.Schema(
  {
    severe_violation: [
      "Code 5.1",
      "Code 5.2",
      "Code 5.5",
      "WHA 58.32",
      "WHA 63.23",
      "Code 9.1",
      "Code 9.2",
      "2016 WHO Guidance REC4",
      "2016 WHO Guidance REC6/COI",
    ],
    moderate_violation: [
      "Code 5.3",
      "Code 9.2",
      "Code 4.2",
      "2016 WHO Guidance REC5",
    ],
    minor_violation: ["Code 4.3", "2016 WHO Guidance Rec4 (Inadequate info)"],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Codes", codesSchema);
