const puppeteer = require("puppeteer");
// Library to manage files
const fs = require("fs");

let rooms: any;

const saveToFile = (data: any) => {
  fs.writeFile(
    "./data/rooms.json",
    JSON.stringify(data),
    "utf8",
    (err: any) => {
      if (err) {
        console.log(err);
      }
    }
  );
};

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
  // console.log(games)
  await browser.close();
  // return games;
  // saveToFile(games);
  rooms = games;
  getMoreAboutGames(0);
};

getGames();

const getMoreAboutGames = async (index: number) => {
  if (index < rooms.length - 1) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(rooms[index].domain, { waitUntil: "networkidle2" });

    const myFunction = (node: HTMLElement | null) => {
      if (node) {
        return node.innerText; // Property 'innerText' does not exist on 'T'
      }
    };

    // Summary
    const summary = await page.evaluate(() => {
      // return myFunction(document.querySelector(".content"));
      const node = document.querySelector(".content") as HTMLElement;
      return node.innerText;
    });

    // Availabilities
    const availabilities = await page.evaluate(() => {
      // return myFunction(document.querySelector(".content"));
      const node = document.querySelector(".top15 > a") as HTMLElement;
      return node && node.getAttribute("href");
    });

    // Room addresses
    const roomAddresses = await page.evaluate(() => {
      const array = [
        ...document.querySelectorAll(".room-address"),
      ] as HTMLElement[];
      return array.map((element) => {
        return {
          link: element.getAttribute("href"),
          location: element.innerText,
          coords: {
            lat: element.getAttribute("href")?.split("=")[1].split(",")[0],
            lng: element.getAttribute("href")?.split("=")[1].split(",")[1],
          },
        };
      });
    });

    // Booking
    const booking = await page.evaluate(() => {
      return (
        document.querySelector("#jsBookingSection > a") &&
        document
          .querySelector("#jsBookingSection > a")
          ?.getAttribute("href")
          ?.split("?")[0]
      );
    });

    // Specs
    const specs = await page.evaluate(() => {
      const array = [
        ...document.querySelectorAll(".room-specs > div"),
      ] as HTMLElement[];
      return array.map((e) => {
        const key = e.innerText.split("\n")[0];
        const value = e.innerText.split("\n")[1];
        // [key] est une clé dynamique
        return { [key]: value };
      });
    });

    // console.log({ summary, availabilities, roomAddresses, booking, specs });

    await browser.close();
    index++;
    getMoreAboutGames(index);
  } else {
    // enregistrer les datas dans mon fichier
    saveToFile(rooms);
  }
};

// getMoreAboutGames();
