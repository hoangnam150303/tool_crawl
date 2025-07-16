const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
  const browser = await puppeteer.launch({ headless: false }); // Launch browser in non-headless mode for manual login
  const page = await browser.newPage();

  await page.goto("https://www.facebook.com/login/?locale=vi_VN", {
    waitUntil: "networkidle2",
  });

  console.log(" After login success! Please press enter button.");

  //wait for user to login manually
  process.stdin.once("data", async () => {
    const cookies = await page.cookies();
    fs.writeFileSync("cookies.json", JSON.stringify(cookies, null, 2));
    console.log("✅Saved cookies to cookies.json");
    await browser.close();
    process.exit();
  });
})();
