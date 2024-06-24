const canvas = document.querySelector("#draw");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.strokeStyle = "rgb(255, 126, 0)";
ctx.lineJoin = "round";
ctx.lineCap = "square";

function generateColour() {
  const colours = [
    "#e8441f",
    "#fa920d",
    "#f4cd00",
    "#54ab1d",
    "#3d58e3",
    "#e195bb",
    "#aa4d7e",
    "#34495e",
    "#fffeff",
    "#949398FF",
    "#F4DF4EFF",
    "#FC766AFF",
    "#5B84B1FF",
    "#5F4B8BFF",
    "#E69A8DFF",
    "#42EADDFF",
    "#CDB599FF",
    "#00A4CCFF",
    "#F95700FF",
    "#00203FFF",
    "#ADEFD1FF",
    "#606060FF",
    "#D6ED17FF",
    "#ED2B33FF",
    "#D85A7FFF",
    "#2C5F2D",
    "#97BC62FF",
    "#00539CFF",
    "#EEA47FFF",
    "#0063B2FF",
    "#9CC3D5FF",
    "#D198C5FF",
    "#E0C568FF",
    "#101820FF",
    "#FEE715FF",
    "#CBCE91FF",
    "#EA738DFF",
    "#F93822FF",
    "#FDD20EFF",
  ];

  let randomNumber = Math.floor(Math.random() * colours.length);
  return colours[randomNumber];
}

const colour1 = generateColour();
const colour2 = generateColour();

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let hue = 0;
let direction = true;

function draw(e) {
  let randomBrushSize = Math.floor(Math.random() * 100 + 10);
  const randomLoc = () => {
    return Math.floor(Math.random() * 300);
  };

  ctx.lineWidth = randomBrushSize;
  if (!isDrawing) return;
  ctx.strokeStyle = colour1;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.stroke();
  ctx.fillStyle = colour1;
  ctx.fillRect(lastX + randomLoc(), lastY + randomLoc(), randomBrushSize, randomBrushSize);
  [lastX, lastY] = [e.offsetX ?? e.touches[0].clientX, e.offsetY ?? e.touches[0].clientY];

  let randomBrushSize2 = Math.floor(Math.random() * 100 + 10);
  ctx.lineWidth = randomBrushSize2;
  ctx.strokeStyle = colour2;
  ctx.beginPath();
  ctx.moveTo(lastX + 200, lastY);
  ctx.stroke();
  ctx.fillStyle = colour2;
  ctx.fillRect(lastX + randomLoc(), lastY + randomLoc(), randomBrushSize2, randomBrushSize2);
  [lastX, lastY] = [e.offsetX ?? e.touches[0].clientX, e.offsetY ?? e.touches[0].clientY];
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
