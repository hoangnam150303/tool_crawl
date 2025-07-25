const puppeteer = require("puppeteer");
const fs = require("fs-extra");

/**
 * This function crawls a Facebook page to extract posts
 * It uses Puppeteer to navigate to the page and extract post data
 */
module.exports = async function crawlFacebook(url, scrollCount = 10) {
  const browser = await puppeteer.launch({
    // Launch a new browser instance
    // set headless to false to see the browser actions
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
    ],
  });

  const page = await browser.newPage(); // Open a new page

  try {
    //set cookies
    if (fs.existsSync("Facecookies.json")) {
      const cookies = JSON.parse(fs.readFileSync("Facecookies.json", "utf8"));
      await page.setCookie(...cookies);
    }
    page.on("console", (msg) => {
      for (let i = 0; i < msg.args().length; ++i)
        msg
          .args()
          [i].jsonValue()
          .then((val) => console.log(`PAGE LOG:`, val));
    });

    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
    await new Promise((res) => setTimeout(res, 4000)); // chờ load

    // Scroll to load more posts
    for (let i = 0; i < scrollCount; i++) {
      await page.evaluate(() => {
        window.scrollBy({
          top: window.innerHeight,
          left: 0,
          behavior: "smooth",
        });
      });
      await new Promise((res) => setTimeout(res, 3000)); // wait for scroll
    }

    const posts = await page.evaluate(() => {
      const data = []; // create data array for save posts
      const postBlocks = document.querySelectorAll('[role="article"]'); // select all post blocks

      for (const post of postBlocks) {
        // loop through each post block
        console.log("Found post:", post.innerText);
        const titleEl = post.querySelector('div[dir="auto"], span[dir="auto"]'); // select title element
        const title = titleEl?.innerText?.trim() || "No title"; // get title text or set default
        const imageEl = post.querySelector('img[src*="scontent"]'); // select image element
        const imageUrl = imageEl?.src || null; // get image URL or set null
        const authorEl = post.querySelector(
          'h2 a, strong a, span a[role="link"]'
        );
        const authorName = authorEl?.innerText?.trim() || null;
        const linkEl = post.querySelector(
          // select link element
          'a[href*="/posts/"], a[href*="/photos/"]'
        );
        const timeEl =
          post.querySelector("abbr") ||
          post.querySelector("a[aria-label][href*='/posts/']") ||
          post.querySelector("span[aria-label]");

        const timeText =
          timeEl?.getAttribute("aria-label") ||
          timeEl?.getAttribute("title") ||
          timeEl?.innerText ||
          null;
        const postDate = timeText ? new Date(timeText).toISOString() : null;

        let articleUrl = linkEl?.getAttribute("href") || null; // get article URL or set null

        if (articleUrl && !articleUrl.startsWith("http")) {
          // check if URL is relative
          articleUrl = "https://facebook.com" + articleUrl;
        }

        if (title !== "No title" || imageUrl) {
          // check if title or image exists
          data.push({
            title,
            imageUrl,
            articleUrl,
            authorName,
            postDate,
            platform: "facebook",
            date: new Date().toISOString(),
          });
        }
      }

      return data; // return collected data
    });

    await browser.close(); // close browser
    return posts;
  } catch (err) {
    await browser.close();
    throw err;
  }
};
