const canvas = document.querySelector("#draw");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.lineJoin = "round";
ctx.lineCap = "square";

function generateColour() {
  const colours = [
    "#f4cd00",
    "#fa920d",
    "#e8441f",
    "#46c35b",
    "#3ba7ff",
    "#3d58e3",
    "#e195bb",
    "#05d6f0",
    "#fe5a01",
    "#ff7469",
    "#a44cd3",
    "#f1c40f",
    "#ffae42",
    "#228c22",
    "#e090df",
    "#ff2c2c",
    "#ffea00",
    "#54ab1d",
  ];

  let randomNumber = Math.floor(Math.random() * colours.length);
  return colours[randomNumber];
}

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let hue = 0;
let direction = true;

function drawWithBrush(upperLimit, colour, brushSize, randomLoc, event) {
  if (!isDrawing) return;
  ctx.lineWidth = brushSize;
  ctx.strokeStyle = colour;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.stroke();
  ctx.fillStyle = colour;
  ctx.fillRect(
    lastX + randomLoc(upperLimit),
    lastY + randomLoc(upperLimit),
    brushSize,
    brushSize
  );
  [lastX, lastY] = [
    event.offsetX ?? event.touches[0].clientX,
    event.offsetY ?? event.touches[0].clientY,
  ];
}

let colour1 = generateColour();
let colour2 = generateColour();
let colour3 = generateColour();

function headsOrTails() {
  return Math.floor(Math.random() * 10) === 0;
}

function draw(event) {
  let randomBrushSize = Math.floor(Math.random() * 100 + 10);
  let randomBrushSize2 = Math.floor(Math.random() * 150 + 50);
  let randomBrushSize3 = Math.floor(Math.random() * 200 + 100);

  const randomLoc = (upperLimit) => {
    return Math.floor(Math.random() * (upperLimit * 2 + 1)) - upperLimit;
  };

  if (headsOrTails()) {
    drawWithBrush(500, colour2, randomBrushSize3, randomLoc, event);
  }

  if (headsOrTails()) {
    drawWithBrush(100, colour3, randomBrushSize, randomLoc, event);
  }

  if (headsOrTails()) {
    drawWithBrush(50, colour1, randomBrushSize2, randomLoc, event);
  }

  if (!isDrawing) return;
}

canvas.addEventListener("mousemove", (e) => {
  isDrawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", () => (isDrawing = false));
canvas.addEventListener("mouseout", () => (isDrawing = false));

canvas.addEventListener("touchstart", function (event) {
  isDrawing = true;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  [lastX, lastY] = [event.touches[0].clientX, event.touches[0].clientY];
});

canvas.addEventListener("touchend", function (event) {
  isDrawing = false;
});

document.addEventListener("touchmove", draw);

document.addEventListener("click", () => {
  colour1 = generateColour();
  colour2 = generateColour();
  colour3 = generateColour();
});
