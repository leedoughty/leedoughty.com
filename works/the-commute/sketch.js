let palette = [
  "#009dff",
  "#ff4500",
  "#ffc400",
  "#8bc34a",
  "#0051ff",
  "#926eff",
  "#e75397",
  "#01b2e8",
  "#e8441f",
  "#ff6a00",
  "#f7a000",
  "#f4cd00",
  "#54ab1d",
  "#1b82e6",
  "#6d5acf",
  "#dddddd",
  "#ff437f",
  "#ff8f35",
  "#4dc268",
  "#647582",
  "#f6f6f6",
  "#028ff5",
  "#ff99cc",
  "#22d3ee",
  "#15ad03",
  "#ff6347",
  "#ffec99",
  "#7fff00",
  "#0077b6",
  "#b983ff",
  "#fafafa",
  "#ffcc00",
  "#3ddc84",
  "#004c6d",
  "#e6a6f5",
  "#ffdab9",
  "#4a90e2",
  "#ffead0",
  "#d72638",
  "#ffeb3b",
  "#2196f3",
  "#9c27b0",
];

const n = 500;
const maxH = 500;
const minH = 100;
const maxW = 1000;
const minW = 200;

let seed;

window.setup = () => {
  createCanvas(windowWidth, windowHeight, WEBGL);
  palette = palette.map((c) => color(c));
  seed = random(10000);
};

window.draw = () => {
  background("#181818");
  randomSeed(seed);
  ambientLight(80);
  directionalLight(255, 255, 255, -0.5, -1, -0.3);
  pointLight(255, 255, 255, 0, 0, 500);

  camera(0, 0, height / 4, 0, 0, 0, 0, 1, 0);
  noStroke();

  for (let i = 0; i < n; i++) {
    const c = color(random(palette));
    c.setAlpha(map(sin(millis() / 1000 + i), -1, 1, 150, 255));

    fill(c);
    specularMaterial(random(palette));
    shininess(250);
    ambientMaterial(c);
    specularMaterial(c);
    shininess(50);

    const rnd = random() > 0.5 ? 1 : -1;
    const w = random(minW, maxW);
    const h = random(minH, maxH);

    push();
    rotateY((rnd * PI) / 3);
    const x = ((random(width * 4) + millis() / 3) % (width * 4)) - w / 2;
    if (w / 2 - x < 0) {
      translate(rnd * x, random(-height, height), -random(width * 4));
      plane(w, h);
    } else {
      translate(
        rnd * (x / 2 + w / 4),
        random(-height, height),
        -random(width * 4),
      );
      plane(w / 2 + x, h);
    }
    pop();
  }
};
