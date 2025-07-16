const puppeteer = require("puppeteer");
/**
 * This function crawls Facebook posts from a given URL
 * It uses Puppeteer to navigate to the page and extract post data
 */
module.exports = async function crawlFacebook(url) {
  const browser = await puppeteer.launch({ headless: "new" }); // Use headless mode
  const page = await browser.newPage(); // Open a new page

  await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 }); // Navigate to the Facebook page

  const posts = await page.evaluate(() => {
    // Extract posts from the page
    const data = []; // Initialize an array to hold post data
    const postBlocks = document.querySelectorAll('[role="article"]'); // Select all post blocks

    for (const post of postBlocks) {
      // Iterate over each post block
      const titleElement = post.querySelector('div[data-ad-preview="message"]'); // Select the title element
      const imageElement = post.querySelector('img[src*="scontent"]'); // Select the image element
      const linkElement = post.querySelector('a[href*="/posts/"]'); // Select the link element

      if (!titleElement && !imageElement) continue; // skip if no content

      const title = titleElement?.innerText.trim() || "No title"; // Get the title text
      const imageUrl = imageElement?.src || null; // Get the image URL, if available
      const articleUrl = linkElement?.href || null;

      data.push({
        title,
        imageUrl,
        articleUrl,
        platform: "facebook",
        date: new Date().toISOString(),
      });
    }

    return data;
  });

  await browser.close();

  return posts;
};
