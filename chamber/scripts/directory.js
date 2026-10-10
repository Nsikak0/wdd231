const memberDirectory = document.querySelector("#member-directory");
const directoryStatus = document.querySelector("#directory-status");
const viewButtons = document.querySelectorAll(".view-button");
const currentYear = document.querySelector("#current-year");
const lastModified = document.querySelector("#last-modified");

if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}

if (lastModified) {
  lastModified.textContent = document.lastModified;
}

function makeTextElement(tagName, className, text) {
  const element = document.createElement(tagName);
  element.className = className;
  element.textContent = text;
  return element;
}

function makeMemberCard(member) {
  const card = document.createElement("article");
  card.className = "member-card surface";
  card.dataset.level = String(member.membershipLevel);

  const logo = document.createElement("img");
  logo.className = "member-card__logo";
  logo.src = `images/${member.image}`;
  logo.alt = `${member.name} logo`;
  logo.width = 160;
  logo.height = 160;
  logo.loading = "lazy";

  const name = makeTextElement("h3", "member-card__name", member.name);
  const industry = makeTextElement(
    "p",
    "member-card__industry",
    member.industry,
  );
  const description = makeTextElement(
    "p",
    "member-card__description",
    member.description,
  );

  const details = document.createElement("div");
  details.className = "member-card__details";

  const address = makeTextElement("span", "", member.address);
  const phone = document.createElement("a");
  phone.href = `tel:${member.phone.replace(/[^\d+]/g, "")}`;
  phone.textContent = member.phone;

  const website = document.createElement("a");
  website.href = member.website;
  website.target = "_blank";
  website.rel = "noopener noreferrer";
  website.textContent = "Visit website (sample)";

  details.append(address, phone, website);

  const membershipLabel = ["Member", "Silver member", "Gold member"][
    member.membershipLevel - 1
  ];
  const level = makeTextElement(
    "span",
    "member-card__level",
    membershipLabel,
  );

  card.append(logo, name, industry, description, details, level);
  return card;
}

async function loadMembers() {
  try {
    const response = await fetch("data/members.json");
    if (!response.ok) {
      throw new Error(`Member directory request failed: ${response.status}`);
    }

    const members = await response.json();
    if (!Array.isArray(members)) {
      throw new TypeError("Member directory data must be an array.");
    }

    const cards = members.map(makeMemberCard);
    memberDirectory.replaceChildren(...cards);
    directoryStatus.textContent = `${members.length} sample organizations in the directory`;
  } catch (error) {
    console.error("Unable to load the member directory.", error);
    directoryStatus.textContent = "The directory could not be loaded. Please try again later.";
    const message = makeTextElement(
      "p",
      "directory-error",
      "We could not retrieve the directory members. Please check your connection and try again.",
    );
    memberDirectory.replaceChildren(message);
  }
}

viewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const view = button.dataset.view;
    if (view !== "grid" && view !== "list") {
      return;
    }

    memberDirectory.classList.toggle("member-directory--grid", view === "grid");
    memberDirectory.classList.toggle("member-directory--list", view === "list");
    viewButtons.forEach((viewButton) => {
      const isActive = viewButton === button;
      viewButton.classList.toggle("is-active", isActive);
      viewButton.setAttribute("aria-pressed", String(isActive));
    });
  });
});

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

loadMembers();
