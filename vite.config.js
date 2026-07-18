import { resolve } from "path";
import { defineConfig } from "vite";
import fs from "fs";
import { execSync } from "child_process";

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
      // Only header pages have the toggle, so skip the init on standalone canvas pages.
      if (html.includes("{{header}}")) {
        const headInit = fs.readFileSync("./partials/head-init.html", "utf-8");
        html = html.replace("<head>", `<head>\n${headInit}`);
      }

      return html
        .replace(
          "{{header}}",
          fs.readFileSync("./partials/header.html", "utf-8"),
        )
        .replace("</head>", `${umamiScript}\n</head>`);
    },
  };
}

const SITE_URL = "https://leedoughty.com";

function lastmod(file) {
  try {
    // Falls back to file mtime when git history is unavailable (e.g. some CI builds).
    const date = execSync(`git log -1 --pretty=format:%cs -- "${file}"`, {
      encoding: "utf-8",
    }).trim();
    if (date) return date;
  } catch {}

  return fs.statSync(file).mtime.toISOString().slice(0, 10);
}

function sitemap() {
  return {
    name: "sitemap",
    apply: "build",
    generateBundle() {
      const urls = [
        { path: "/", file: "index.html" },
        { path: "/about.html", file: "about.html" },
        { path: "/artworks.html", file: "artworks.html" },
        { path: "/projects.html", file: "projects.html" },
        { path: "/contact.html", file: "contact.html" },
        ...Object.keys(pages).map((folder) => ({
          path: `/works/${folder}/index.html`,
          file: `works/${folder}/index.html`,
        })),
      ];

      const entries = urls
        .map(
          ({ path, file }) =>
            `  <url>\n    <loc>${SITE_URL}${path}</loc>\n    <lastmod>${lastmod(file)}</lastmod>\n  </url>`,
        )
        .join("\n");

      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`,
      });
    },
  };
}

export default defineConfig({
  plugins: [htmlPartials(), sitemap()],
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
