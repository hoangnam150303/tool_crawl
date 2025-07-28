const express = require("express");
const crawlRoute = express.Router();
const upload = require("../middleware/multer");
const crawlersController = require("../controller/crawlers.controller");
crawlRoute.get("/crawlAutomatic", crawlersController.crawlAutomatic);
// Route POST upload file JSON
crawlRoute.post(
  "/upload-json",
  upload.single("file"),
  crawlersController.handleAddJsonFile
);

crawlRoute.post("/crawl/:advertiser_id", crawlersController.handleCrawl);
crawlRoute.get("/getPost/:id", crawlersController.getPostById);

module.exports = crawlRoute;
