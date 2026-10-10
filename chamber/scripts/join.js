const currentYear = document.querySelector("#current-year");
const lastModified = document.querySelector("#last-modified");
const timestamp = document.querySelector("#timestamp");

if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}

if (lastModified) {
  lastModified.textContent = document.lastModified;
}

if (timestamp) {
  timestamp.value = new Date().toISOString();
}

const dialogOpeners = new WeakMap();

document.querySelectorAll(".membership-info-link").forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!(target instanceof HTMLDialogElement)) {
      return;
    }

    event.preventDefault();
    dialogOpeners.set(target, link);
    target.showModal();
    target.querySelector(".dialog-close")?.focus();
  });
});

document.querySelectorAll(".membership-dialog").forEach((dialog) => {
  dialog.querySelector(".dialog-close")?.addEventListener("click", () => {
    dialog.close();
  });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });

  dialog.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      dialog.close();
    }
  });

  dialog.addEventListener("close", () => {
    dialogOpeners.get(dialog)?.focus();
    dialogOpeners.delete(dialog);
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
