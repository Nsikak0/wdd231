const placesGrid = document.querySelector("#places-grid");
const placesStatus = document.querySelector("#places-status");
const categoryFilter = document.querySelector("#category-filter");
const regionFilter = document.querySelector("#region-filter");
const resultCount = document.querySelector("#result-count");
const detailsDialog = document.querySelector("#place-dialog");
const dialogTitle = document.querySelector("#dialog-title");
const dialogBody = document.querySelector("#dialog-body");
const savedCount = document.querySelector("#saved-count");
const savedKey = "explore-akwa-ibom-saved-places";

let places = [];
let activeButton = null;

function readSavedPlaces() {
  try {
    const saved = JSON.parse(localStorage.getItem(savedKey) ?? "[]");
    return Array.isArray(saved) ? saved.filter((id) => typeof id === "string") : [];
  } catch (error) {
    console.error("Unable to read saved places.", error);
    return [];
  }
}

function updateSavedCount() {
  savedCount.textContent = String(readSavedPlaces().length);
}

function buildPlaceCard(place) {
  const article = document.createElement("article");
  article.className = "place-card";
  article.dataset.category = place.category;

  const figure = document.createElement("figure");
  figure.className = "place-card__image";
  const image = document.createElement("img");
  image.src = `images/${place.image}`;
  image.alt = place.imageAlt;
  image.width = 520;
  image.height = 293;
  image.loading = "lazy";
  image.decoding = "async";
  figure.append(image);

  const content = document.createElement("div");
  content.className = "place-card__content";
  const category = document.createElement("p");
  category.className = "eyebrow";
  category.textContent = `${place.category} · ${place.region}`;

  const heading = document.createElement("h2");
  heading.textContent = place.name;

  const location = document.createElement("p");
  location.className = "place-card__location";
  location.textContent = place.location;

  const description = document.createElement("p");
  description.textContent = place.description;

  const highlight = document.createElement("p");
  highlight.className = "place-card__highlight";
  highlight.textContent = place.highlight;

  const duration = document.createElement("p");
  duration.className = "place-card__duration";
  duration.textContent = `Suggested time: ${place.duration}`;

  const actions = document.createElement("div");
  actions.className = "place-card__actions";
  const detailsButton = document.createElement("button");
  detailsButton.className = "button button--quiet";
  detailsButton.type = "button";
  detailsButton.textContent = "More details";
  detailsButton.setAttribute("aria-label", `More details about ${place.name}`);
  detailsButton.addEventListener("click", () => openPlaceDialog(place, detailsButton));

  const saveButton = document.createElement("button");
  saveButton.className = "button button--save";
  saveButton.type = "button";
  saveButton.addEventListener("click", () => toggleSavedPlace(place.id, saveButton));
  updateSaveButton(saveButton, place.id);

  actions.append(detailsButton, saveButton);
  content.append(category, heading, location, description, highlight, duration, actions);
  article.append(figure, content);
  return article;
}

function updateSaveButton(button, placeId) {
  const isSaved = readSavedPlaces().includes(placeId);
  button.textContent = isSaved ? "Saved to plan" : "Save for trip";
  button.setAttribute("aria-pressed", String(isSaved));
}

function toggleSavedPlace(placeId, button) {
  const saved = readSavedPlaces();
  const next = saved.includes(placeId)
    ? saved.filter((savedId) => savedId !== placeId)
    : [...saved, placeId];
  try {
    localStorage.setItem(savedKey, JSON.stringify(next));
  } catch (error) {
    console.error("Unable to save this place in browser storage.", error);
    placesStatus.textContent = "Your browser could not save this place. Check storage settings and try again.";
    return;
  }
  updateSaveButton(button, placeId);
  updateSavedCount();
  placesStatus.textContent = next.includes(placeId)
    ? "Added to your trip plan."
    : "Removed from your trip plan.";
}

function openPlaceDialog(place, opener) {
  dialogTitle.textContent = place.name;
  dialogBody.replaceChildren();
  const location = document.createElement("p");
  location.textContent = `${place.location} · ${place.region}`;
  const details = document.createElement("p");
  details.textContent = place.description;
  const visitTip = document.createElement("p");
  visitTip.textContent = place.highlight;
  const timing = document.createElement("p");
  timing.textContent = `Suggested time: ${place.duration}.`;
  const source = document.createElement("a");
  source.href = place.sourceUrl;
  source.target = "_blank";
  source.rel = "noopener noreferrer";
  source.textContent = `Read more: ${place.sourceName}`;
  const photoCredit = document.createElement("a");
  photoCredit.href = place.imageSourceUrl;
  photoCredit.target = "_blank";
  photoCredit.rel = "noopener noreferrer";
  photoCredit.textContent = `Photo by ${place.imageCredit} (CC BY-SA 4.0; cropped and resized)`;
  dialogBody.append(location, details, visitTip, timing, source, photoCredit);
  activeButton = opener;
  detailsDialog.showModal();
  detailsDialog.querySelector(".dialog-close").focus();
}

function renderPlaces() {
  const selectedCategory = categoryFilter.value;
  const selectedRegion = regionFilter.value;
  const filtered = places.filter((place) => {
    const categoryMatches = selectedCategory === "all" || place.category === selectedCategory;
    const regionMatches = selectedRegion === "all" || place.region === selectedRegion;
    return categoryMatches && regionMatches;
  });
  placesGrid.replaceChildren(...filtered.map(buildPlaceCard));
  resultCount.textContent = `Showing ${filtered.length} of ${places.length} places`;
  placesStatus.textContent = filtered.length
    ? "Select a destination for more details or save it to your trip plan."
    : "No places match those filters. Try a different combination.";
}

function fillSelect(select, label, values) {
  const fragment = document.createDocumentFragment();
  for (const value of values) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value === "all" ? `All ${label}` : value;
    fragment.append(option);
  }
  select.append(fragment);
}

async function loadPlaces() {
  placesStatus.textContent = "Loading destinations…";
  try {
    const response = await fetch("data/places.json");
    if (!response.ok) {
      throw new Error(`Destination data request failed with status ${response.status}.`);
    }
    const data = await response.json();
    if (!Array.isArray(data) || data.length < 15) {
      throw new TypeError("Destination data must contain at least 15 records.");
    }
    places = data;
    fillSelect(categoryFilter, "categories", ["all", ...new Set(places.map((place) => place.category))]);
    fillSelect(regionFilter, "regions", ["all", ...new Set(places.map((place) => place.region))]);
    renderPlaces();
  } catch (error) {
    console.error("Unable to load Akwa Ibom destinations.", error);
    placesStatus.textContent =
      "Destinations could not be loaded. Please refresh the page or check your connection.";
    resultCount.textContent = "Destination list unavailable";
  }
}

categoryFilter.addEventListener("change", renderPlaces);
regionFilter.addEventListener("change", renderPlaces);
detailsDialog.querySelector(".dialog-close").addEventListener("click", () => detailsDialog.close());
detailsDialog.addEventListener("click", (event) => {
  if (event.target === detailsDialog) detailsDialog.close();
});
detailsDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  detailsDialog.close();
});
detailsDialog.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    event.preventDefault();
    detailsDialog.close();
  }
});
detailsDialog.addEventListener("close", () => {
  activeButton?.focus();
  activeButton = null;
});

updateSavedCount();
loadPlaces();
