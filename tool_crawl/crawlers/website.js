const puppeteer = require("puppeteer");

/**
 * This function crawls a generic website to extract posts
 * It uses Puppeteer to navigate to the page and extract post data
 */
module.exports = async function crawlGenericWebsite(url) {
  const browser = await puppeteer.launch({ headless: "new" }); // Launch a new browser instance
  const page = await browser.newPage(); // Open a new page

  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 }); // Navigate to the provided URL

    // Wait for the page to load and ensure there are images present
    await page.waitForSelector("img", { timeout: 10000 });

    const posts = await page.evaluate(() => {
      const data = [];
      const anchors = document.querySelectorAll("a");

      for (let i = 0; i < anchors.length; i++) {
        const a = anchors[i];

        const img = a.querySelector("img");
        const titleTag = a.querySelector("h1, h2, h3, p, span");
        const title = titleTag?.innerText?.trim() || img?.alt || "No title";
        const imageUrl = img?.src || null;
        const articleUrl = a.href;
        if (!imageUrl || !articleUrl || title === "No title") continue; // Skip if any required field is missing
        if (imageUrl && articleUrl) {
          data.push({
            title,
            imageUrl,
            articleUrl,
            platform: "website",
            date: new Date(Date.now() - i * 3600000).toISOString(),
          });
        }
      }
      return data;
    });

    await browser.close();
    return posts;
  } catch (error) {
    await browser.close();
    return error.message;
  }
};
