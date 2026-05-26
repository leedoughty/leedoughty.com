import { resolve } from "path";
import { defineConfig } from "vite";
import fs from "fs";

const pages = fs.readdirSync("./works").reduce((entries, folder) => {
  if (fs.existsSync(`./works/${folder}/index.html`)) {
    entries[folder] = resolve(__dirname, `works/${folder}/index.html`);
  }

  return entries;
}, {});

const umamiScript = `<script defer src="https://lee-doughty-umami.vercel.app/script.js" data-website-id="14dc46cd-d286-4bc4-ad90-a0d6de32afc7"></script>`;

function htmlPartials() {
  return {
    name: "html-partials",
    transformIndexHtml(html) {
      return html
        .replace(
          "{{header}}",
          fs.readFileSync("./partials/header.html", "utf-8"),
        )
        .replace("</head>", `${umamiScript}\n</head>`);
    },
  };
}

export default defineConfig({
  plugins: [htmlPartials()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        about: resolve(__dirname, "about.html"),
        contact: resolve(__dirname, "contact.html"),
        artworks: resolve(__dirname, "artworks.html"),
        projects: resolve(__dirname, "projects.html"),
        ...pages,
      },
    },
  },
});
