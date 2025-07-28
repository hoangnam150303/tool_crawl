const puppeteer = require("puppeteer");

module.exports = async function crawlGenericWebsite(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
    ],
  });

  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

    try {
      await page.waitForSelector("img", { timeout: 10000 });
    } catch {
      console.warn("No images found, but continuing scrape...");
    }

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
        if (!imageUrl || !articleUrl || title === "No title") continue;

        data.push({
          title,
          imageUrl,
          articleUrl,
          platform: "website",
          date: new Date(Date.now() - i * 3600000).toISOString(),
        });
      }

      return data;
    });

    await browser.close();
    return posts;
  } catch (error) {
    console.error("Crawling error:", error.message);
    await browser.close();
    return [];
  }
};
