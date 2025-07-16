const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const crawlersController = require("../controller/crawlers.controller");

// Route POST upload file JSON
router.post(
  "/upload-json",
  upload.single("file"),
  crawlersController.handleAddJsonFile
);

router.post("/crawl", crawlersController.handleCrawl);
router.get("/getPost/:id", crawlersController.getPostById);

module.exports = router;
