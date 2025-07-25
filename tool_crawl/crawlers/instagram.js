const puppeteer = require("puppeteer");
const fs = require("fs-extra");

/**
 * This function crawls an Instagram profile to extract posts
 * It uses Puppeteer to navigate to the profile and extract post data
 */
module.exports = async function crawlInstagram(profileUrl, scrollCount = 3) {
  const browser = await puppeteer.launch({
    headless: true, // set headless to false to see the browser actions
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
    ],
  });

  const page = await browser.newPage(); // Open a new page

  try {
    // Set cookies if available
    const cookies = JSON.parse(fs.readFileSync("Instacookies.json", "utf8"));
    await page.setCookie(...cookies);

    // Navigate to the Instagram profile
    await page.goto(profileUrl, { waitUntil: "networkidle2", timeout: 60000 });
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Scroll to load more posts
    for (let i = 0; i < scrollCount; i++) {
      await page.evaluate(() => window.scrollBy(0, window.innerHeight));
      await new Promise((resolve) => setTimeout(resolve, 2000)); // wait for scroll
    }

    // Extract posts from the page
    const posts = await page.evaluate(() => {
      const data = []; // create data array for saving posts
      const imgEls = document.querySelectorAll("div._aagu img"); // Select all image elements

      for (const img of imgEls) {
        // Loop through each image element
        const title = img.alt?.trim() || "No title"; // Get title from alt text or set default
        const imageUrl = img.src || null;
        const articleUrl = null; // Instagram does not provide direct article URLs in this context

        if (title === "No title" && !imageUrl) continue; // Skip if title and image URL are not available

        data.push({
          // Push post data to array
          title,
          imageUrl,
          articleUrl,
          platform: "instagram",
          date: new Date().toISOString(),
        });
      }

      return data; // Return the collected post data
    });

    await browser.close(); // Close the browser
    return posts; // Return the extracted posts
  } catch (err) {
    await browser.close();
    throw err;
  }
};
