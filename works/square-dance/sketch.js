function resolveCollision(p1, p2) {
  const xVelDiff = p1.velocity.x - p2.velocity.x;
  const yVelDiff = p1.velocity.y - p2.velocity.y;
  const xDist = p2.x - p1.x;
  const yDist = p2.y - p1.y;

  if (xVelDiff * xDist + yVelDiff * yDist >= 0) {
    const angle = -atan2(yDist, xDist);
    const u1 = rotateVector(p1.velocity, angle);
    const u2 = rotateVector(p2.velocity, angle);
    const v1 = createVector(
      (u1.x * (p1.mass - p2.mass)) / (p1.mass + p2.mass) +
        (u2.x * 2 * p2.mass) / (p1.mass + p2.mass),
      u1.y
    );
    const v2 = createVector(
      (u2.x * (p1.mass - p2.mass)) / (p1.mass + p2.mass) +
        (u1.x * 2 * p1.mass) / (p1.mass + p2.mass),
      u2.y
    );
    const vFinal1 = rotateVector(v1, -angle);
    const vFinal2 = rotateVector(v2, -angle);
    p1.velocity.x = vFinal1.x;
    p1.velocity.y = vFinal1.y;
    p2.velocity.x = vFinal2.x;
    p2.velocity.y = vFinal2.y;
    Object.assign(p1, randomAppearance());
    Object.assign(p2, randomAppearance());
  }
}

function rotateVector(v, angle) {
  return createVector(
    v.x * cos(angle) - v.y * sin(angle),
    v.x * sin(angle) + v.y * cos(angle)
  );
}

function handleCollisions(p, all) {
  for (let other of all) {
    if (other === p) continue;
    if (dist(p.x, p.y, other.x, other.y) < p.size * 2) {
      resolveCollision(p, other);
    }
  }
}

function handleBounds(p) {
  if (p.x - p.size <= 0 || p.x + p.size >= width) {
    p.velocity.x *= -1;
  }
  if (p.y - p.size <= 0 || p.y + p.size >= height) {
    p.velocity.y *= -1;
  }
}

const colours = [
  "#ff2c2c",
  "#ffae42",
  "#fce205",
  "#46c35b",
  "#3d58e3",
  "#be2ed6",
  "#e8441f",
  "#fe5a01",
  "#fa920d",
  "#f4cd00",
  "#54ab1d",
  "#14a6ff",
  "#6d5acf",
  "#e090df",
  "#abb6b2",
  "#eae3d0",
  "#15ad03",
  "#02bdfd",
  "#a0742c",
  "#b29815",
  "#ce8f5f",
  "#e67e22",
  "#4a6374",
  "#ffbf00",
  "#028ff5",
  "#9b59b6",
  "#fe2f03",
  "#378805",
  "#c3b091",
  "#e195bb",
  "#fb4a70",
  "#e7db00",
  "#ff7469",
  "#dc2828",
  "#fff017",
  "#009dff",
  "#ff4500",
  "#ffc400",
  "#8bc34a",
  "#0051ff",
  "#e75397",
  "#01b2e8",
  "#e8441f",
  "#ff6a00",
  "#f7a000",
  "#54ab1d",
  "#1b82e6",
  "#6d5acf",
  "#dddddd",
  "#ff437f",
  "#4dc268",
  "#647582",
  "#f6f6f6",
  "#028ff5",
  "#ff99cc",
  "#15ad03",
  "#ff6347",
  "#ffec99",
  "#7fff00",
  "#0077b6",
  "#fafafa",
  "#ffcc00",
  "#3ddc84",
  "#e6a6f5",
  "#ffdab9",
  "#ffead0",
  "#d72638",
  "#ffeb3b",
  "#2196f3",
  "#9c27b0",
  "#926eff",
  "#f4cd00",
  "#ff8f35",
  "#22d3ee",
  "#b983ff",
];

function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function shuffleArray(arr) {
  let a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

let particles = [];
let numberOfParticles;
const squareSize = 40;

function createParticle(x, y, size) {
  return {
    x,
    y,
    size,
    mass: 1,
    velocity: createVector(random(-1, 1), random(-1, 1)),
    ...randomAppearance(),
  };
}

function randomAppearance() {
  const palette = shuffleArray(colours);
  const count = randomIntFromRange(2, 5);
  const steps = Array.from({ length: count }, () => randomIntFromRange(3, 8));
  return { colours: palette, numberOfSquares: count, sizeSteps: steps };
}

function updateParticle(p, all) {
  handleCollisions(p, all);
  handleBounds(p);
  p.x += p.velocity.x;
  p.y += p.velocity.y;
  drawParticle(p);
}

function drawParticle(p) {
  let s = p.size;
  rectMode(CENTER);
  for (let i = 0; i < p.numberOfSquares; i++) {
    fill(p.colours[i]);
    noStroke();
    rect(p.x, p.y, s * 2, s * 2, 4);
    s = max(0, s - p.sizeSteps[i]);
  }
  fill("#efefe3");
  rect(p.x, p.y, 16, 16, 4);
}

window.setup = () => {
  createCanvas(windowWidth, windowHeight);
  numberOfParticles = windowWidth > 600 ? 20 : 7;
  particles = Array.from({ length: numberOfParticles }, () =>
    createParticle(random(50, width - 50), random(50, height - 50), squareSize)
  );
};

window.draw = () => {
  background("#022bdf");
  particles.forEach((p) => updateParticle(p, particles));
};

window.mousePressed = () => {
  particles.push(createParticle(mouseX, mouseY, squareSize));
};

window.windowResized = () => {
  resizeCanvas(windowWidth, windowHeight);
};
