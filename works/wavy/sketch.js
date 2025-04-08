let grid = [];
let cols = 20;
let rows = 20;
let loc = 100;

let colours = [
  "#009dff",
  "#ff4500",
  "#ffc400",
  "#8bc34a",
  "#0051ff",
  "#926eff",
  "#bdbdbd",
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

class Cell {
  constructor(x0, y0, r, angle) {
    this.r = r;
    this.angle = angle;
    this.x0 = x0;
    this.y0 = y0;
    this.color = random(colours);
    this.stroke = random(colours);
  }

  update() {
    this.x = this.r * cos(this.angle);
    this.y = this.r * sin(this.angle);
    this.angle += 0.05;
  }

  display() {
    fill(this.color);
    strokeWeight(2);
    stroke(this.stroke);
    rect(this.x0 + this.x, this.y0 + this.y, 30, 5);
  }
}

window.setup = function () {
  createCanvas(windowWidth, windowHeight);
  let rowSize = height / rows;
  let colSize = width / cols;

  for (let i = 0; i < cols; i++) {
    grid[i] = [];
    for (let j = 0; j < rows; j++) {
      grid[i][j] = new Cell(
        colSize / 2 + i * colSize,
        rowSize / 2 + j * rowSize,
        rowSize / 2,
        i * loc + j * loc
      );
    }
  }
};

window.draw = function () {
  background("#f3f2f2");
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].update();
      grid[i][j].display();
    }
  }
};
