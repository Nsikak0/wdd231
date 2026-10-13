const shortlist = document.querySelector("#shortlist");
const shortlistStatus = document.querySelector("#shortlist-status");
const clearButton = document.querySelector("#clear-shortlist");
const savedKey = "explore-akwa-ibom-saved-places";
let places = [];

function getSavedIds() {
  try {
    const value = JSON.parse(localStorage.getItem(savedKey) ?? "[]");
    return Array.isArray(value) ? value.filter((id) => typeof id === "string") : [];
  } catch (error) {
    console.error("Unable to read your trip shortlist.", error);
    shortlistStatus.textContent = "Saved places are unavailable in this browser.";
    return [];
  }
}

function removeSavedPlace(id) {
  const next = getSavedIds().filter((savedId) => savedId !== id);
  try {
    localStorage.setItem(savedKey, JSON.stringify(next));
    renderShortlist();
  } catch (error) {
    console.error("Unable to update your trip shortlist.", error);
    shortlistStatus.textContent = "Your browser could not update the saved places.";
  }
}

function renderShortlist() {
  const savedIds = getSavedIds();
  const savedPlaces = places.filter((place) => savedIds.includes(place.id));
  if (!savedPlaces.length) {
    const empty = document.createElement("p");
    empty.textContent = "Your shortlist is empty. Explore destinations and save a few ideas for your visit.";
    shortlist.replaceChildren(empty);
    shortlistStatus.textContent = "No destinations saved yet.";
    return;
  }

  const list = document.createElement("ul");
  list.className = "shortlist-list";
  for (const place of savedPlaces) {
    const item = document.createElement("li");
    item.className = "shortlist-item";
    const text = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = place.name;
    const location = document.createElement("p");
    location.textContent = `${place.location} · ${place.category} · ${place.duration}`;
    text.append(title, location);
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "button button--quiet";
    remove.textContent = "Remove";
    remove.setAttribute("aria-label", `Remove ${place.name} from your plan`);
    remove.addEventListener("click", () => removeSavedPlace(place.id));
    item.append(text, remove);
    list.append(item);
  }
  shortlist.replaceChildren(list);
  shortlistStatus.textContent = `${savedPlaces.length} ${savedPlaces.length === 1 ? "place" : "places"} saved for your trip.`;
}

async function loadSavedPlaces() {
  try {
    const response = await fetch("data/places.json");
    if (!response.ok) {
      throw new Error(`Place data request failed with status ${response.status}.`);
    }
    places = await response.json();
    renderShortlist();
  } catch (error) {
    console.error("Unable to load the trip shortlist.", error);
    shortlistStatus.textContent = "Your plan could not be loaded. Please refresh the page and try again.";
  }
}

clearButton.addEventListener("click", () => {
  try {
    localStorage.setItem(savedKey, "[]");
    loadSavedPlaces();
  } catch (error) {
    console.error("Unable to clear your trip shortlist.", error);
    shortlistStatus.textContent = "Your browser could not clear the saved places.";
  }
});

const timestamp = document.querySelector("#submitted-at");
timestamp.value = new Date().toISOString();
loadSavedPlaces();
