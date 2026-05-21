// Language toggle
function getInitialLang() {
  const stored = localStorage.getItem("site.lang");
  if (stored) return stored;
  return navigator.language?.startsWith("ja") ? "ja" : "en";
}

function setLang(lang, animate) {
  if (animate && document.documentElement.lang === lang) return;

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.setAttribute("aria-pressed", btn.dataset.setLang === lang);
  });

  if (animate) {
    document.documentElement.classList.add("lang-fading");
    setTimeout(() => {
      document.documentElement.lang = lang;
      localStorage.setItem("site.lang", lang);
      requestAnimationFrame(() => {
        document.documentElement.classList.remove("lang-fading");
      });
    }, 160);
  } else {
    document.documentElement.lang = lang;
    localStorage.setItem("site.lang", lang);
  }
}

setLang(getInitialLang());

document.querySelectorAll(".lang-btn").forEach((btn) => {
  btn.addEventListener("click", () => setLang(btn.dataset.setLang, true));
});

// Dark mode toggle
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
  document.querySelectorAll(".contact-link").forEach((link) => {
    link.classList.add("dark-mode-contact-links");
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
  document.querySelectorAll(".contact-link").forEach((link) => {
    link.classList.remove("dark-mode-contact-links");
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
