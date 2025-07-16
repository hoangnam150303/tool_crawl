const crawlFacebook = require("../crawlers/facebook");
const crawlInstagram = require("../crawlers/instagram");
const crawlWebsite = require("../crawlers/website");
const Post = require("../models/Post");
const fs = require("fs");
const path = require("path");
const os = require("os");

/*
 * This function handles the crawling of URLs provided in the request body
 * It checks the platform of each URL and calls the appropriate crawler function
 */
exports.handleCrawl = async (req, res) => {
  try {
    const { urls } = req.body; // get urls from request body
    if (!urls) {
      // check if urls are provided
      return res.status(400).json({ error: "URL is required" });
    }
    let inserted = [];
    // iterate through each URL
    let result = []; // variable to store result of crawling
    if (urls.includes("facebook.com")) {
      // check if URL is for Facebook

      result = await crawlFacebook(urls); // crawl Facebook
      inserted = await Post.insertMany(result); // insert crawled posts into MongoDB
    } else if (urls.includes("instagram.com")) {
      // check if URL is for Instagram
      result = await crawlInstagram(urls); // crawl Instagram
      inserted = await Post.insertMany(result); // insert crawled posts into MongoDB
    } else {
      result = await crawlWebsite(urls);
      inserted = await Post.insertMany(result);
    }

    const simplified = inserted.map(
      ({ _id, title, imageUrl, articleUrl, platform, date }) => ({
        _id,
        title,
        imageUrl,
        articleUrl,
        date,
        platform,
      })
    );

    // Save the simplified posts to a file in the user's Downloads directory
    const homeDir = os.homedir(); // get home directory of the user
    const downloadsDir = path.join(homeDir, "Downloads"); // I want to save the file in Downloads
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-"); // create a timestamp for the file name
    const fileName = `crawl-output-${timestamp}.json`; // create a file name with the timestamp
    const fullPath = path.join(downloadsDir, fileName); // create the full path for the file
    fs.writeFileSync(fullPath, JSON.stringify(simplified, null, 2), "utf-8"); // write the simplified posts to the file

    res.status(200).json(simplified);
  } catch (error) {
    console.error("Error during crawling:", error);
    return res.status(500).json({ error: "Crawling failed" });
  }
};

/**
 * This function handles the addition of a JSON file uploaded by the user
 * It reads the JSON file, parses it, and saves the data to MongoDB
 */
exports.handleAddJsonFile = async (req, res) => {
  try {
    if (!req.file) {
      // check if file is uploaded
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path; // get the path of the uploaded file

    // read file JSON
    const jsonContent = fs.readFileSync(filePath, "utf8"); // read the content of the file
    const data = JSON.parse(jsonContent); // parse the JSON content

    if (!Array.isArray(data)) {
      // check if the parsed data is an array
      return res
        .status(400)
        .json({ error: "Invalid JSON format. Must be an array." }); // return error
    }

    // save data to MongoDB
    const post = await Post.insertMany(data);

    res.status(200).json({
      // return success message
      message: "Successfully saved JSON to DB",
      data: post,
    });
  } catch (error) {
    // handle errors
    res.status(500).json({ error: "Đã xảy ra lỗi khi lưu file JSON vào DB" });
  }
};

/**
 * * This function retrieves all posts from the database
 * It returns the posts in a simplified format
 */
exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params; // get the post ID from the request parameters
    const post = await Post.findById(id); // find the post by ID in MongoDB
    if (!post) {
      return res.status(404).json({ error: "Post not found" }); // return error if post not found
    }
    res.status(200).json(post);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while fetching the post" });
  }
};
