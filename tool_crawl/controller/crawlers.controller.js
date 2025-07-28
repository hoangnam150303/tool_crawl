const crawlFacebook = require("../crawlers/facebook");
const crawlInstagram = require("../crawlers/instagram");
const crawlWebsite = require("../crawlers/website");

const Post = require("../models/Post");
const fs = require("fs");
const path = require("path");
const os = require("os");
async function readLinksFromFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  return raw.split(/\r?\n/).filter(Boolean);
}
/*
 * This function handles the crawling of URLs provided in the request body
 * It checks the platform of each URL and calls the appropriate crawler function
 */
exports.handleCrawl = async (req, res) => {
  try {
    const { urls } = req.body;
    const { advertiser_id } = req.params;

    if (!urls) {
      return res.status(400).json({ error: "URL is required" });
    }

    let result = [];

    if (urls.includes("facebook.com")) {
      result = await crawlFacebook(urls);
    } else if (urls.includes("instagram.com")) {
      result = await crawlInstagram(urls);
    } else {
      result = await crawlWebsite(urls);
    }

    if (!Array.isArray(result)) {
      console.error("Crawler output is not an array:", result);
      return res.status(500).json({ error: "Crawler did not return an array" });
    }

    // Chuẩn hóa dữ liệu từ crawler
    const formattedPosts = result.map((item) => ({
      advertiser_id,
      content: {
        text: item.title || item.content || "",
        label: false,
      },
      image: {
        url: item.imageUrl || "",
        label: false,
      },
      process_id: null,
    }));

    // Tìm các bài đã tồn tại
    const texts = formattedPosts.map((p) => p.content.text);
    const existing = await Post.find({ "content.text": { $in: texts } }).select(
      "content.text"
    );
    const existingTexts = new Set(existing.map((e) => e.content.text));

    // Chỉ chèn những post mới chưa có
    const uniquePosts = formattedPosts.filter(
      (p) => !existingTexts.has(p.content.text)
    );
    const inserted =
      uniquePosts.length > 0 ? await Post.insertMany(uniquePosts) : [];

    // Trả về tất cả data crawl được (dù đã insert hay chưa)
    const responseData = formattedPosts.map((p) => ({
      title: p.content.text,
      imageUrl: p.image.url,
      inserted: !existingTexts.has(p.content.text), // true nếu là post mới được insert
    }));

    // Ghi vào file JSON
    // const downloadsDir = path.join(os.homedir(), "Downloads");
    // const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    // const fileName = `crawl-output-${timestamp}.json`;
    // const fullPath = path.join(downloadsDir, fileName);

    // fs.writeFileSync(fullPath, JSON.stringify(responseData, null, 2), "utf-8");

    return res.status(200).json(responseData);
  } catch (error) {
    console.error("Error during crawling:", error);
    return res.status(500).json({ error: "Crawling failed" });
  }
};

exports.crawlAutomatic = async (req, res) => {
  const filePath = path.join(__dirname, "../input/link.txt");
  const links = await readLinksFromFile(filePath);

  for (const link of links) {
    try {
      if (link.includes("facebook.com")) {
        const result = await crawlFacebook(link);
        console.log("✅ Facebook crawled:", result);
      } else if (link.includes("instagram.com")) {
        const result = await crawlInstagram(link);
        console.log("✅ Instagram crawled:", result);
      } else if (link.includes("tiktok.com")) {
        const result = await crawlTiktok(link);
        console.log("✅ Tiktok crawled:", result);
      } else {
        console.warn("⛔ Unknown platform:", link);
      }
    } catch (err) {
      console.error("❌ Error crawling:", link, err.message);
    }
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
