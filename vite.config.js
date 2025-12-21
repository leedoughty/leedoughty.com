import { resolve } from "path";
import { defineConfig } from "vite";
import fs from "fs";

const pages = fs.readdirSync("./works").reduce((entries, folder) => {
  if (fs.existsSync(`./works/${folder}/index.html`)) {
    entries[folder] = resolve(__dirname, `works/${folder}/index.html`);
  }

  return entries;
}, {});

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        about: resolve(__dirname, "about.html"),
        contact: resolve(__dirname, "contact.html"),
        artworks: resolve(__dirname, "artworks.html"),
        ...pages,
      },
    },
  },
});
