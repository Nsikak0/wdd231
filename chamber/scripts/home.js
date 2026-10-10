const currentYear = document.querySelector("#current-year");
const lastModified = document.querySelector("#last-modified");
const weatherCurrent = document.querySelector("#weather-current");
const weatherForecast = document.querySelector("#weather-forecast");
const spotlightList = document.querySelector("#spotlight-list");

if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}

if (lastModified) {
  lastModified.textContent = document.lastModified;
}

const weatherDescriptions = new Map([
  [0, "Clear sky"],
  [1, "Mainly clear"],
  [2, "Partly cloudy"],
  [3, "Overcast"],
  [45, "Fog"],
  [48, "Depositing rime fog"],
  [51, "Light drizzle"],
  [53, "Moderate drizzle"],
  [55, "Dense drizzle"],
  [56, "Light freezing drizzle"],
  [57, "Dense freezing drizzle"],
  [61, "Slight rain"],
  [63, "Moderate rain"],
  [65, "Heavy rain"],
  [66, "Light freezing rain"],
  [67, "Heavy freezing rain"],
  [71, "Slight snow"],
  [73, "Moderate snow"],
  [75, "Heavy snow"],
  [77, "Snow grains"],
  [80, "Slight rain showers"],
  [81, "Moderate rain showers"],
  [82, "Violent rain showers"],
  [85, "Slight snow showers"],
  [86, "Heavy snow showers"],
  [95, "Thunderstorm"],
  [96, "Thunderstorm with light hail"],
  [99, "Thunderstorm with heavy hail"],
]);

function weatherDescription(code) {
  return weatherDescriptions.get(code) ?? "Conditions unavailable";
}

function makeElement(tagName, className, text) {
  const element = document.createElement(tagName);
  element.className = className;
  element.textContent = text;
  return element;
}

function formatDay(dateString) {
  return new Intl.DateTimeFormat("en-NG", {
    weekday: "short",
    timeZone: "Africa/Lagos",
  }).format(new Date(`${dateString}T12:00:00`));
}

async function loadWeather() {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.search = new URLSearchParams({
    latitude: "6.5244",
    longitude: "3.3792",
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
    daily: "weather_code,temperature_2m_max,temperature_2m_min",
    timezone: "Africa/Lagos",
    forecast_days: "3",
  });

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather request failed: ${response.status}`);
    }

    const weather = await response.json();
    if (!weather.current || !weather.daily) {
      throw new TypeError("Weather response is missing current or daily data.");
    }

    const current = weather.current;
    weatherCurrent.replaceChildren();

    const currentTop = document.createElement("div");
    currentTop.className = "weather-current__top";
    currentTop.append(
      makeElement(
        "p",
        "weather-temperature",
        `${Math.round(current.temperature_2m)}°C`,
      ),
      makeElement(
        "p",
        "weather-description",
        weatherDescription(current.weather_code),
      ),
    );

    const currentDetails = document.createElement("div");
    currentDetails.className = "weather-details";
    currentDetails.append(
      makeElement(
        "p",
        "",
        `Feels like ${Math.round(current.apparent_temperature)}°C`,
      ),
      makeElement(
        "p",
        "",
        `Humidity ${Math.round(current.relative_humidity_2m)}%`,
      ),
      makeElement(
        "p",
        "",
        `Wind ${Math.round(current.wind_speed_10m)} km/h`,
      ),
    );
    weatherCurrent.append(currentTop, currentDetails);

    const forecastItems = weather.daily.time.map((date, index) => {
      const forecast = document.createElement("article");
      forecast.className = "forecast-day";
      forecast.append(
        makeElement("h4", "", formatDay(date)),
        makeElement(
          "p",
          "forecast-day__description",
          weatherDescription(weather.daily.weather_code[index]),
        ),
        makeElement(
          "p",
          "forecast-day__temperatures",
          `Low ${Math.round(weather.daily.temperature_2m_min[index])}° · High ${Math.round(weather.daily.temperature_2m_max[index])}°C`,
        ),
      );
      return forecast;
    });
    weatherForecast.replaceChildren(...forecastItems);
  } catch (error) {
    console.error("Unable to load Lagos weather.", error);
    weatherCurrent.replaceChildren(
      makeElement(
        "p",
        "weather-error",
        "Current weather is temporarily unavailable. Please try again later.",
      ),
    );
    weatherForecast.replaceChildren(
      makeElement(
        "p",
        "weather-error",
        "The forecast could not be loaded.",
      ),
    );
  }
}

function createSpotlight(member) {
  const card = document.createElement("article");
  card.className = "spotlight-card surface";
  card.dataset.level = String(member.membershipLevel);

  const logo = document.createElement("img");
  logo.className = "spotlight-card__logo";
  logo.src = `images/${member.image}`;
  logo.alt = `${member.name} logo`;
  logo.width = 160;
  logo.height = 160;
  logo.loading = "lazy";

  const information = document.createElement("div");
  information.className = "spotlight-card__information";
  information.append(
    makeElement("p", "eyebrow eyebrow--green", member.industry),
    makeElement("h3", "", member.name),
    makeElement("p", "spotlight-card__description", member.description),
  );

  const details = document.createElement("div");
  details.className = "spotlight-card__details";
  const address = makeElement("p", "", member.address);
  const phone = document.createElement("a");
  phone.href = `tel:${member.phone.replace(/[^\d+]/g, "")}`;
  phone.textContent = member.phone;
  const website = document.createElement("a");
  website.href = member.website;
  website.target = "_blank";
  website.rel = "noopener noreferrer";
  website.textContent = "Visit website";
  const levelName = ["Member", "Silver Member", "Gold Member"][
    member.membershipLevel - 1
  ];
  details.append(
    address,
    phone,
    website,
    makeElement("span", "spotlight-card__level", levelName),
  );

  card.append(logo, information, details);
  return card;
}

async function loadSpotlights() {
  try {
    const response = await fetch("data/members.json");
    if (!response.ok) {
      throw new Error(`Member data request failed: ${response.status}`);
    }

    const members = await response.json();
    if (!Array.isArray(members)) {
      throw new TypeError("Member data must be an array.");
    }

    const eligibleMembers = members.filter(
      (member) => member.membershipLevel === 2 || member.membershipLevel === 3,
    );
    if (eligibleMembers.length < 2) {
      throw new RangeError("At least two silver or gold members are required.");
    }

    const shuffledMembers = [...eligibleMembers];
    for (let index = shuffledMembers.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [shuffledMembers[index], shuffledMembers[randomIndex]] = [
        shuffledMembers[randomIndex],
        shuffledMembers[index],
      ];
    }

    const cards = shuffledMembers.slice(0, 3).map(createSpotlight);
    spotlightList.replaceChildren(...cards);
  } catch (error) {
    console.error("Unable to load member spotlights.", error);
    spotlightList.replaceChildren(
      makeElement(
        "p",
        "spotlight-error",
        "Member spotlights are temporarily unavailable.",
      ),
    );
  }
}

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-navigation");

if (menuButton && navigation) {
  const closeMenu = () => {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
    navigation.classList.remove("is-open");
  };

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
    navigation.classList.toggle("is-open", !isOpen);
  });

  navigation.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

loadWeather();
loadSpotlights();
