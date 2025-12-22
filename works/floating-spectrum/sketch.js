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
  "#f48c06",
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
  "#9c27b0",
  "#ffead0",
  "#d72638",
  "#ffeb3b",
  "#2196f3",
  "#ff595e",
  "#ff924c",
  "#ffca3a",
  "#8ac926",
  "#1982c4",
  "#6a4c93",
  "#f72585",
  "#7209b7",
  "#3a0ca3",
  "#4361ee",
  "#4cc9f0",
  "#00bbf9",
  "#00f5d4",
  "#9ef01a",
  "#faff00",
  "#ff9f1c",
  "#ff4040",
  "#cdb4db",
  "#a2d2ff",
  "#b5ead7",
  "#caffbf",
  "#e0fbfc",
  "#f1c0e8",
  "#e8eddf",
  "#ffe66d",
  "#06d6a0",
  "#118ab2",
  "#ef476f",
  "#ffd6e0",
  "#ff99c8",
];

const n = 500;
const maxH = 1000;
const minH = 100;
const maxW = 500;
const minW = 100;

let seed;

window.setup = () => {
  createCanvas(windowWidth, windowHeight, WEBGL);
  palette = palette.map((c) => color(c));
  seed = random(10000);
  noStroke();

  let t = millis() * 0.001;
  let r = width * 1.2;
  let angle = t * 0.05;
  let camX = cos(angle) * r;
  let camZ = sin(angle) * r - width * 2;
  camera(camX, 0, camZ, 0, 0, -width * 2, 0, 1, 0);
};

window.draw = () => {
  background("#34495e");

  let t = millis() * 0.001;
  let r = width * 1.2;
  let angle = t * 0.05;

  orbitControl(1, 1, 0.3);

  randomSeed(seed);
  noiseSeed(seed);

  for (let i = 0; i < n; i++) {
    push();
    let base = palette[i % palette.length];
    let c = color(
      base.levels[0],
      base.levels[1],
      base.levels[2],
      map(sin(t + i * 0.1), -1, 1, 100, 220)
    );
    fill(c);
    shininess(20);

    let w = map(sin(i * 0.1), -1, 1, minW, maxW);
    let h = map(cos(i * 0.15), -1, 1, minH, maxH);

    let nx = noise(i * 0.01, t * 0.1);
    let ny = noise(i * 0.01 + 500, t * 0.1 + 10);
    let nz = noise(i * 0.01 + 1000, t * 0.1 - 10);
    let ox = (noise(i * 5) - 0.5) * 1000;
    let oy = (noise(i * 5 + 1000) - 0.5) * 1000;
    let oz = (noise(i * 5 + 2000) - 0.5) * 1000;

    let x = map(noise(i * 0.02 + ox, t * 0.1, 10), 0, 1, -width * 2, width * 2);
    let y = map(
      noise(i * 0.03 + oy + 100, t * 0.1, 20),
      0,
      1,
      -height * 1.5,
      height * 1.5
    );
    let z = map(
      noise(i * 0.01 + oz + 200, t * 0.1, 30),
      0,
      1,
      -width * 4,
      -200
    );

    translate(x, y, z);
    rotateX(t * 0.1 + i * 0.03);
    rotateY(t * 0.05 + i * 0.015);

    plane(w, h);
    pop();
  }
};
