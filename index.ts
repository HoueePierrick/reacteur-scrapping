const puppeteer = require("puppeteer");

const getGames = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://www.escapegame.fr/paris/", {
    waitUntil: "networkidle2",
  });

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
            Number(
              el
                .querySelector(".user-rating")
                ?.textContent?.trim()
                .split(/\s/)[0]
                .slice(0, -1)
            ),
          thumbnail: el
            .querySelector(".card-room-hero-image > img")
            ?.getAttribute("src")
            ?.split("?")[0],
          domain:
            el.querySelector(".card-link")?.getAttribute("href") &&
            `https://www.escapegame.fr/paris${el
              .querySelector(".card-link")
              ?.getAttribute("href")}`.slice(0, 5) === `https`
              ? `https://www.escapegame.fr/paris${el
                  .querySelector(".card-link")
                  ?.getAttribute("href")
                  ?.substring(6)}`
              : `https://www.escapegame.fr/paris${el
                  .querySelector(".card-link")
                  ?.getAttribute("href")}`,
        };
      }
    );
  });
  await browser.close();
  return games;
};

// getGames();

const getMoreAboutGames = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(
    "https://www.escapegame.fr/paris/quest-factory/cannibal-island/",
    { waitUntil: "networkidle2" }
  );

  const myFunction = (node: HTMLElement | null) => {
    if (node) {
      return node.innerText; // Property 'innerText' does not exist on 'T'
    }
  };

  const summary = await page.evaluate(() => {
    // return myFunction(document.querySelector(".content"));
    const node = document.querySelector(".content") as HTMLElement;
    return node.innerText;
  });

  console.log({ summary });

  await browser.close();
};

getMoreAboutGames();
