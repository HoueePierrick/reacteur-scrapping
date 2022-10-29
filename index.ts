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
          name: el.querySelector(".card-title a")?.textContent?.trim(),
          brand: el.querySelector(".card-room-brand-city")?.textContent?.trim(),
          "room-summary": el
            .querySelector(".room-summary")
            ?.textContent?.trim(),
          // .trim() vire les espaces en trop
          snooping: Number(
            el.querySelector(".room-snooping") &&
              el
                .querySelector(".room-snooping")
                ?.textContent?.trim()
                .split(/\s/)[0]
          ),
          handling: Number(
            el.querySelector(".room-handling") &&
              el
                .querySelector(".room-handling")
                ?.textContent?.trim()
                .split(/\s/)[0]
          ),
          thinking: Number(
            el.querySelector(".room-thinking") &&
              el
                .querySelector(".room-thinking")
                ?.textContent?.trim()
                .split(/\s/)[0]
          ),
          rating: Number(
            (
              Number(
                el.querySelector(".rating-full") &&
                  el
                    .querySelector(".rating-full")
                    ?.getAttribute("style")
                    ?.split(" ")[1]
                    .slice(0, -3)
              ) / 17
            ).toFixed(1)
          ),
          "user-rating":
            el.querySelector(".user-rating") &&
            // Travailler sur ça
            el.querySelector(".user-rating")?.textContent?.trim().split(" "),
        };
      }
    );
  });
  console.log(games);
  await browser.close();
})();
