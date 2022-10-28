const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://www.escapegame.fr/paris/");

  // Get the "viewport" of the page, as reported by the page
  const games = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("#jsRooms article")).map(
      (el) => {
        return {
          name: el.querySelector(".card-title a")?.textContent,
        };
      }
    );
  });
  console.log(games);
  await browser.close();
})();
