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
  "#f54927",
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
let gridCols = 6;
let gridRows = 6;
let squareSize = 50;
let animationProgress = 0;
const animationSpeed = 0.008;
let animationDirection = 1;
let pauseTimer = 0;
const pauseDurationTogether = 300;
const pauseDurationScattered = 5;
const margin = 100;

function calculateGridDimensions() {
  const availableWidth = width - margin * 2;
  const availableHeight = height - margin * 2;
  const aspectRatio = availableWidth / availableHeight;
  const baseGridSize = 6;

  if (aspectRatio > 1.2) {
    gridCols = Math.round(baseGridSize * Math.sqrt(aspectRatio));
    gridRows = baseGridSize;
  } else if (aspectRatio < 0.8) {
    gridCols = baseGridSize;
    gridRows = Math.round(baseGridSize / Math.sqrt(aspectRatio));
  } else {
    gridCols = baseGridSize;
    gridRows = baseGridSize;
  }

  const squareSizeByWidth = availableWidth / (gridCols * 2);
  const squareSizeByHeight = availableHeight / (gridRows * 2);

  squareSize = Math.min(squareSizeByWidth, squareSizeByHeight);
}

function createParticle(startX, startY, targetX, targetY, size) {
  const palette = shuffleArray(colours);
  const count = randomIntFromRange(2, 5);
  const steps = Array.from({ length: count }, () => randomIntFromRange(8, 20));

  return {
    startX,
    startY,
    targetX,
    targetY,
    x: startX,
    y: startY,
    size,
    colours: palette,
    numberOfSquares: count,
    sizeSteps: steps,
  };
}

function getEdgePosition(index, total) {
  const perimeter = (width + height) * 2;
  const spacing = perimeter / total;
  const distance = spacing * index;

  if (distance < width) {
    return { x: distance, y: -100 };
  } else if (distance < width + height) {
    return { x: width + 100, y: distance - width };
  } else if (distance < width * 2 + height) {
    return { x: width - (distance - width - height), y: height + 100 };
  } else {
    return { x: -100, y: height - (distance - width * 2 - height) };
  }
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function updateParticle(p) {
  const t = easeInOutCubic(min(animationProgress, 1));
  p.x = lerp(p.startX, p.targetX, t);
  p.y = lerp(p.startY, p.targetY, t);

  drawParticle(p);
}

function drawParticle(p) {
  let s = p.size;
  rectMode(CENTER);
  for (let i = 0; i < p.numberOfSquares; i++) {
    fill(p.colours[i]);
    noStroke();
    rect(p.x, p.y, s * 2, s * 2);
    s = max(0, s - p.sizeSteps[i]);
  }
  fill("#efefe3");
  rect(p.x, p.y, 16, 16);
}

window.setup = () => {
  createCanvas(windowWidth, windowHeight);
  calculateGridDimensions();
  initialiseParticles();
};

function initialiseParticles() {
  particles = [];

  const totalBoxWidth = gridCols * squareSize * 2;
  const totalBoxHeight = gridRows * squareSize * 2;
  const centerX = width / 2;
  const centerY = height / 2;
  const startX = centerX - totalBoxWidth / 2 + squareSize;
  const startY = centerY - totalBoxHeight / 2 + squareSize;

  let particleIndex = 0;
  for (let row = 0; row < gridRows; row++) {
    for (let col = 0; col < gridCols; col++) {
      const targetX = startX + col * squareSize * 2;
      const targetY = startY + row * squareSize * 2;

      const edgePos = getEdgePosition(particleIndex, gridCols * gridRows);

      particles.push(
        createParticle(edgePos.x, edgePos.y, targetX, targetY, squareSize),
      );

      particleIndex++;
    }
  }

  animationProgress = 0;
}

function regenerateColours() {
  particles.forEach((p) => {
    const palette = shuffleArray(colours);
    const count = randomIntFromRange(2, 5);
    const steps = Array.from({ length: count }, () =>
      randomIntFromRange(8, 20),
    );
    p.colours = palette;
    p.numberOfSquares = count;
    p.sizeSteps = steps;
  });
}

window.draw = () => {
  background("#e9e3d5");

  if (pauseTimer > 0) {
    pauseTimer--;
    particles.forEach((p) => drawParticle(p));
    return;
  }

  if (animationDirection === 1) {
    animationProgress += animationSpeed;
    if (animationProgress >= 1) {
      animationProgress = 1;
      pauseTimer = pauseDurationTogether;
      animationDirection = -1;
    }
  } else {
    animationProgress -= animationSpeed;

    if (animationProgress <= 0) {
      animationProgress = 0;
      regenerateColours();
      pauseTimer = pauseDurationScattered;
      animationDirection = 1;
    }
  }

  particles.forEach((p) => updateParticle(p));
};

window.mousePressed = () => {
  animationProgress = 0;
  animationDirection = 1;
  pauseTimer = 0;
  initialiseParticles();
};

window.windowResized = () => {
  resizeCanvas(windowWidth, windowHeight);
  calculateGridDimensions();
  initialiseParticles();
};
