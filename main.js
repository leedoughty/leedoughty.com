const lightSwitch = document.querySelector(".light-switch");

if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
) {
  if (localStorage.getItem("isDarkMode") === null) {
    localStorage.setItem("isDarkMode", "true");
  }
} else {
  if (localStorage.getItem("isDarkMode") === null) {
    localStorage.setItem("isDarkMode", "false");
  }
}

function applyDarkMode() {
  document.body.classList.add("dark-mode");
  document.querySelector("#heading").classList.add("dark-mode");
  document.querySelectorAll(".work-title").forEach((title) => {
    title.classList.add("dark-mode");
  });
  document.querySelectorAll(".list-link").forEach((link) => {
    link.classList.add("dark-mode-nav-links");
  });
  lightSwitch.classList.add("dark-mode-light-switch");
}

function removeDarkMode() {
  document.body.classList.remove("dark-mode");
  document.querySelector("#heading").classList.remove("dark-mode");
  document.querySelectorAll(".work-title").forEach((title) => {
    title.classList.remove("dark-mode");
  });
  document.querySelectorAll(".list-link").forEach((link) => {
    link.classList.remove("dark-mode-nav-links");
  });
  lightSwitch.classList.remove("dark-mode-light-switch");
}

if (localStorage.getItem("isDarkMode") === "true") {
  applyDarkMode();
}

function toggleMode() {
  if (localStorage.getItem("isDarkMode") === "true") {
    localStorage.setItem("isDarkMode", "false");
    removeDarkMode();
  } else {
    localStorage.setItem("isDarkMode", "true");
    applyDarkMode();
  }
}

lightSwitch.addEventListener("click", toggleMode);
