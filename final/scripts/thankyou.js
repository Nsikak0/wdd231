const confirmation = document.querySelector("#submission-details");
const params = new URLSearchParams(window.location.search);

const fields = [
  ["Name", `${params.get("firstName") ?? ""} ${params.get("lastName") ?? ""}`.trim()],
  ["Email", params.get("email") ?? ""],
  ["Preferred travel month", params.get("travelMonth") ?? ""],
  ["Interests", params.getAll("interest").join(", ")],
  ["Message", params.get("message") ?? ""],
  ["Submitted", params.get("submittedAt") ?? ""],
];

const list = document.createElement("dl");
list.className = "confirmation-list";
for (const [label, value] of fields) {
  const term = document.createElement("dt");
  term.textContent = label;
  const description = document.createElement("dd");
  description.textContent = value || "Not provided";
  list.append(term, description);
}
confirmation.replaceChildren(list);
