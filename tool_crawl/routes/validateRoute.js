const express = require("express");
const validateRoute = express.Router();
const validateController = require("../controller/validate.controller");
const upload = require("../middleware/multer");
validateRoute.post(
  "/validateAdvertiser/:id",
  upload.single("image"),
  validateController.validateAdvertiser
);

module.exports = validateRoute;
