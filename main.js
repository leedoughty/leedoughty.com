// Initial theme and language are applied before paint in partials/head-init.html.
function setLang(lang) {
  if (document.documentElement.lang === lang) return;

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.setAttribute("aria-pressed", btn.dataset.setLang === lang);
  });

  document.documentElement.classList.add("lang-fading");
  setTimeout(() => {
    document.documentElement.lang = lang;
    localStorage.setItem("site.lang", lang);
    requestAnimationFrame(() => {
      document.documentElement.classList.remove("lang-fading");
    });
  }, 160);
}

document.querySelectorAll(".lang-btn").forEach((btn) => {
  btn.setAttribute(
    "aria-pressed",
    btn.dataset.setLang === document.documentElement.lang,
  );
  btn.addEventListener("click", () => setLang(btn.dataset.setLang));
});

const themeToggle = document.querySelector(".theme-toggle");

themeToggle.addEventListener("click", () => {
  const isDark = document.documentElement.classList.toggle("dark-mode");
  localStorage.setItem("isDarkMode", isDark ? "true" : "false");
});
