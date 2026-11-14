import attractions from "../data/attractions.mjs";

const discoverGrid = document.querySelector("#discover-grid");
const discoverStatus = document.querySelector("#discover-status");
const visitMessage = document.querySelector("#visit-message");
const placeDialog = document.querySelector("#place-dialog");
const dialogHeading = document.querySelector("#place-dialog-heading");
const dialogDetails = document.querySelector("#place-dialog-details");
const placeSourceContainer = document.querySelector("#place-source");
const imageSourceContainer = document.querySelector("#image-source");
const lastVisitKey = "nigeria-chamber-discover-last-visit";

function showVisitMessage() {
  const now = Date.now();
  const previousVisit = Number(localStorage.getItem(lastVisitKey));

  if (!Number.isFinite(previousVisit) || previousVisit <= 0 || previousVisit > now) {
    visitMessage.textContent = "Welcome! Let us know if you have any questions.";
  } else {
    const elapsed = now - previousVisit;
    if (elapsed < 24 * 60 * 60 * 1000) {
      visitMessage.textContent = "Back so soon! Awesome!";
    } else {
      const days = Math.floor(elapsed / (24 * 60 * 60 * 1000));
      visitMessage.textContent = `You last visited ${days} ${days === 1 ? "day" : "days"} ago.`;
    }
  }

  localStorage.setItem(lastVisitKey, String(now));
}

function createPlaceCard(place, index) {
  const card = document.createElement("article");
  card.className = "discover-card surface";
  card.style.setProperty("--card-area", `place-${index + 1}`);

  const heading = document.createElement("h2");
  heading.textContent = place.title;

  const figure = document.createElement("figure");
  const image = document.createElement("img");
  image.src = `images/${place.image}`;
  image.alt = place.title;
  image.width = 250;
  image.height = 167;
  image.loading = "lazy";
  image.decoding = "async";
  figure.append(image);

  const address = document.createElement("address");
  address.textContent = place.address;

  const description = document.createElement("p");
  description.className = "discover-card__description";
  description.textContent = place.description;

  const button = document.createElement("button");
  button.className = "discover-card__more";
  button.type = "button";
  button.textContent = "Learn more";
  button.title = "Learn more";
  button.dataset.placeIndex = String(index);
  button.addEventListener("click", () => {
    dialogHeading.textContent = place.title;
    dialogDetails.textContent = place.details;
    placeSourceContainer.innerHTML = "";
    placeSourceContainer.appendChild(
      createSourceLink(place.sourceUrl, "Read more about this place"),
    );
    imageSourceContainer.innerHTML = "";
    imageSourceContainer.appendChild(
      createSourceLink(place.imageSource, "Image source"),
    );
    placeDialog.setAttribute("data-opener", String(index));
    placeDialog.showModal();
    placeDialog.querySelector(".dialog-close").focus();
  });

  card.append(heading, figure, address, description, button);
  return card;
}

function createSourceLink(url, text) {
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = text;
  return link;
}

function closeMenu() {
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#primary-navigation");
  
  if (!menuButton || !navigation) {
    return;
  }
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation menu");
  navigation.classList.remove("is-open");
}

try {
  showVisitMessage();
} catch (error) {
  console.error("Unable to read or save the Discover page visit date.", error);
  visitMessage.textContent =
    "Welcome! Let us know if you have any questions. (Visit history is unavailable in this browser.)";
}

if (Array.isArray(attractions) && attractions.length === 8) {
  discoverGrid.innerHTML = "";
  attractions.forEach((place, index) => {
    discoverGrid.appendChild(createPlaceCard(place, index));
  });
  discoverStatus.textContent = `${attractions.length} places of interest in Lagos State`;
} else {
  discoverStatus.textContent = "Could not load places of interest. Please refresh the page.";
}

placeDialog.querySelector(".dialog-close").addEventListener("click", () => {
  placeDialog.close();
});

placeDialog.addEventListener("click", (event) => {
  if (event.target === placeDialog) {
    placeDialog.close();
  }
});

placeDialog.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    event.preventDefault();
    placeDialog.close();
  }
});

placeDialog.addEventListener("close", () => {
  const opener = placeDialog.getAttribute("data-opener");
  if (opener !== null) {
    const buttons = discoverGrid.querySelectorAll(".discover-card__more");
    if (buttons[opener]) {
      buttons[opener].focus();
    }
  }
});
