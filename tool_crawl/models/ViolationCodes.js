const mongoose = require("mongoose");

const codesSchema = new mongoose.Schema(
  {
    severe_violation: [
      "Code 5.1 - Advertisements",
      "Code 5.2 - Samples",
      "Code 5.5 - Contact with mothers",
      "WHA 58.32 - Nutrition and health claims",
      "WHA 63.23 - Nutrition and health claims",
      "Code 9.1 - Idealizing product or undermining breastfeeding",
      "Code 9.2 - Idealizing product or undermining breastfeeding",
      "2016 WHO Guidance REC4",
      "2016 WHO Guidance REC6/COI",
    ],
    moderate_violation: [
      "Code 5.3 - Discounts",
      "Code 9.2 - Idealizing product or undermining breastfeeding",
      "Code 4.2 - IEM",
      "2016 WHO Guidance REC5",
    ],
    minor_violation: ["Code 4.3 - IEM", "2016 WHO Guidance Rec4 (Inadequate info)"],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Codes", codesSchema);
