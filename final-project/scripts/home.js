const savedCount = document.querySelector("#saved-count");
const savedKey = "explore-akwa-ibom-saved-places";

try {
  const savedPlaces = JSON.parse(localStorage.getItem(savedKey) ?? "[]");
  savedCount.textContent = String(Array.isArray(savedPlaces) ? savedPlaces.length : 0);
} catch (error) {
  console.error("Unable to read the saved-trip count.", error);
  savedCount.textContent = "0";
}
