const SKILL_COLOURS = {
  React: { bg: "#61DAFB", text: "#20232a" },
  TypeScript: { bg: "#3178C6", text: "#ffffff" },
  JavaScript: { bg: "#F7DF1E", text: "#323330" },
  "Next.js": {
    bg: "#000000",
    text: "#ffffff",
    darkBg: "#ffffff",
    darkText: "#000000",
  },
  Svelte: { bg: "#FF3E00", text: "#ffffff" },
  HTML: { bg: "#E34F26", text: "#ffffff" },
  CSS: { bg: "#1572B6", text: "#ffffff" },
  Redux: { bg: "#764ABC", text: "#ffffff" },
  Storybook: { bg: "#FF4785", text: "#ffffff" },
  "Styled Components": { bg: "#DB7093", text: "#ffffff" },
  Accessibility: { bg: "#0056B3", text: "#ffffff" },
  "Node.js": { bg: "#339933", text: "#ffffff" },
  Express: {
    bg: "#000000",
    text: "#ffffff",
    darkBg: "#ffffff",
    darkText: "#000000",
  },
  "REST APIs": { bg: "#009688", text: "#ffffff" },
  JWT: {
    bg: "#000000",
    text: "#D63AFF",
    darkBg: "#1a1a2e",
    darkText: "#D63AFF",
  },
  DynamoDB: { bg: "#4053D6", text: "#ffffff" },
  PostgreSQL: { bg: "#4169E1", text: "#ffffff" },
  "OAuth 2.0": { bg: "#EB5424", text: "#ffffff" },
  OIDC: { bg: "#F78C40", text: "#ffffff" },
  AWS: { bg: "#FF9900", text: "#232F3E" },
  Lambda: { bg: "#FF9900", text: "#232F3E" },
  EC2: { bg: "#FF9900", text: "#232F3E" },
  S3: { bg: "#569A31", text: "#ffffff" },
  CloudWatch: { bg: "#FF4F8B", text: "#ffffff" },
  CodeBuild: { bg: "#68BC71", text: "#232F3E" },
  CodePipeline: { bg: "#68BC71", text: "#232F3E" },
  Docker: { bg: "#2496ED", text: "#ffffff" },
  "CI/CD": { bg: "#40BE46", text: "#ffffff" },
  Git: { bg: "#F05032", text: "#ffffff" },
  Terminal: { bg: "#4D4D4D", text: "#00FF00" },
  Bash: { bg: "#4EAA25", text: "#ffffff" },
  SSL: { bg: "#721412", text: "#ffffff" },
};

function initSkillSparkle() {
  const allTags = document.querySelectorAll(".skills-list li");
  if (!allTags.length) {
    return;
  }

  const isDark = () => document.body.classList.contains("dark-mode");

  function applyColours() {
    const dark = isDark();

    allTags.forEach((li) => {
      const name = li.textContent.trim();
      const colors = SKILL_COLOURS[name];
      if (!colors) return;
      const bg = dark && colors.darkBg ? colors.darkBg : colors.bg;
      const text = dark && colors.darkText ? colors.darkText : colors.text;
      li.style.setProperty("--skill-bg", bg);
      li.style.setProperty("--skill-text", text);
    });
  }

  applyColours();

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.attributeName === "class") {
        applyColours();
        break;
      }
    }
  });

  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ["class"],
  });

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );
  if (prefersReducedMotion.matches) {
    return;
  }

  const litTags = new Set();
  const LIT_DURATION = 1500;
  const SPARKLE_INTERVAL = 800;
  const MAX_LIT = 3;

  function lightUpRandom() {
    if (litTags.size >= MAX_LIT) {
      return;
    }

    const candidates = Array.from(allTags).filter(
      (li) => !litTags.has(li) && !li.matches(":hover"),
    );

    if (!candidates.length) {
      return;
    }

    const tag = candidates[Math.floor(Math.random() * candidates.length)];
    tag.classList.add("skill-lit");
    litTags.add(tag);

    setTimeout(() => {
      tag.classList.remove("skill-lit");
      litTags.delete(tag);
    }, LIT_DURATION);
  }

  let intervalId = setInterval(lightUpRandom, SPARKLE_INTERVAL);

  prefersReducedMotion.addEventListener("change", (e) => {
    if (e.matches) {
      clearInterval(intervalId);
      litTags.forEach((tag) => tag.classList.remove("skill-lit"));
      litTags.clear();
    } else {
      intervalId = setInterval(lightUpRandom, SPARKLE_INTERVAL);
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      clearInterval(intervalId);
    } else if (!prefersReducedMotion.matches) {
      intervalId = setInterval(lightUpRandom, SPARKLE_INTERVAL);
    }
  });
}

initSkillSparkle();
