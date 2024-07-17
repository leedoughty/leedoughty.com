import p5 from "p5";
import "./style.css";

let x, y, w, h, targetX, targetY;
let currentColour,
  targetColour,
  currentWidth,
  currentHeight,
  targetWidth,
  targetHeight;

const colours = [
  "#FF0A0A",
  "#fa920d",
  "#f4cd00",
  "#54ab1d",
  "#3d58e3",
  "#e195bb",
  "#aa4d7e",
  "#CE8F5F",
  "#46C35B",
  "#FF0A0A",
  "#3BA7FF",
  "#8500FF",
  "#FDD20E",
  "#42EADD",
  "#00A4CC",
  "#F95700",
  "#ED2B33",
  "#D85A7F",
  "#D198C5",
  "#FEE715",
  "#F93822",
];

const sketch = (p) => {
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.background("#efefe6");

    x = p.random(p.width - 120);
    y = p.random(p.height - 80);
    w = 120;
    h = 80;
    currentColour = p.color(244, 205, 0);
    targetColour = p.color(p.random(colours));
    targetX = p.random(p.width - 150);
    targetY = p.random(p.height - 150);
    currentWidth = w;
    currentHeight = h;
    targetWidth = p.random(50, 200);
    targetHeight = p.random(30, 150);
  };

  p.draw = () => {
    x = p.lerp(x, targetX, 0.05);
    y = p.lerp(y, targetY, 0.05);
    currentColour = p.lerpColor(currentColour, targetColour, 0.05);
    currentWidth = p.lerp(currentWidth, targetWidth, 0.05);
    currentHeight = p.lerp(currentHeight, targetHeight, 0.05);

    p.fill(currentColour);
    p.noStroke();

    p.rect(x, y, currentWidth, currentHeight);

    if (p.dist(x, y, targetX, targetY) < 1) {
      targetX = p.random(p.width - 150);
      targetY = p.random(p.height - 150);
      targetColour = p.color(p.random(colours));
      targetWidth = p.random(50, 200);
      targetHeight = p.random(30, 150);
    }
  };
};

new p5(sketch);
