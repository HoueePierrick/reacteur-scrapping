const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://developers.google.com/web/");

  // Get the "viewport" of the page, as reported by the page
  const games = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("#jsRooms article"));
  });

  await browser.close();
})();
