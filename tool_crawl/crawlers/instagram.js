const puppeteer = require("puppeteer");
const fs = require("fs");
/**
 * This function crawls an Instagram profile to extract posts
 * It uses Puppeteer to navigate to the profile and extract post data
 */
module.exports = async function crawlInstagram(profileUrl, scrollCount = 3) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  try {
    const cookies = JSON.parse(fs.readFileSync("cookies.json", "utf8")); // Load cookies from file
    await page.setCookie(...cookies); // Set cookies to maintain session

    await page.goto(profileUrl, { waitUntil: "networkidle2", timeout: 60000 }); // Navigate to the Instagram profile

    const selector = "main section div:nth-child(1) a"; // Selector for post links
    await page.waitForSelector(selector, { timeout: 10000 }); // Wait for post links to load

    // Auto scroll để tải thêm bài viết
    for (let i = 0; i < scrollCount; i++) {
      // Scroll down to load more posts
      await page.evaluate(() => {
        window.scrollBy(0, window.innerHeight);
      });
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
    await page.screenshot({ path: "instagram.png" }); // Take a screenshot for debugging

    const posts = await page.evaluate((selector) => {
      // Extract post data
      const data = [];
      const postLinks = document.querySelectorAll(selector);

      for (let linkEl of postLinks) {
        // Iterate over each post link
        const articleUrl =
          "https://www.instagram.com" + linkEl.getAttribute("href");

        const imageEl = linkEl.querySelector("img"); // Select the image element
        const videoEl = linkEl.querySelector("video");

        const imageUrl =
          imageEl?.src || videoEl?.poster || videoEl?.src || null; // Get the image URL, if available
        const title =
          imageEl?.alt?.trim() ||
          videoEl?.getAttribute("aria-label")?.trim() ||
          "";

        if (!title || title === "No caption") continue;

        data.push({
          // Push the post data to the array
          title,
          imageUrl,
          articleUrl,
          platform: "instagram",
          date: new Date().toISOString(),
        });
      }

      return data;
    }, selector);

    await browser.close();
    return posts;
  } catch (error) {
    await page.screenshot({ path: "fatal_error.png" });
    await browser.close();
    throw error;
  }
};
