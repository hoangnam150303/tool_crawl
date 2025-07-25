const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
  const browser = await puppeteer.launch({ headless: false }); // Cho phép bạn tự nhập tài khoản
  const page = await browser.newPage();

  await page.goto("https://www.instagram.com/accounts/login/", {
    waitUntil: "networkidle2",
  });

  console.log(" After login success! Please press enter button.");

  // Đợi bạn đăng nhập xong và nhấn Enter
  process.stdin.once("data", async () => {
    const cookies = await page.cookies();
    fs.writeFileSync("Instacookies.json", JSON.stringify(cookies, null, 2));
    console.log("✅Saved cookies to cookies.json");
    await browser.close();
    process.exit();
  });
})();
