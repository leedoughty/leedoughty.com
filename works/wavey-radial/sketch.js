const colours = [
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
  "#9c27b0",
  "#e6a6f5",
  "#ffdab9",
  "#4a90e2",
  "#ffead0",
  "#d72638",
  "#ffeb3b",
  "#2196f3",
];

class Dot {
  constructor(x, y, angle, speed, scl) {
    this.pos = createVector(x, y);
    this.center = createVector(width / 2, height / 2);
    this.dir = p5.Vector.sub(this.center, this.pos);
    this.maxMag = scl * this.dir.mag();
    this.angle = angle;
    this.speed = speed;
    this.color = random(colours);
    this.stroke = random(colours);
  }

  update() {
    this.oscillation = this.maxMag * sin(this.angle);
    this.oscillationDir = this.dir.copy().setMag(this.oscillation);
    this.newPos = p5.Vector.add(this.pos, this.oscillationDir);

    this.angle += this.speed;
  }

  display() {
    fill(this.color);
    strokeWeight(2);
    stroke(this.stroke);
    rect(this.newPos.x, this.newPos.y, 10);
  }
}

let dots = [];
let cols, rows;
let size = 30;
let margin = 30;
let speed = 0.035;
let scl = 0.1;

window.setup = () => {
  createCanvas(windowWidth, windowHeight);
  cols = (width - margin * 2) / size;
  rows = (height - margin * 2) / size;

  for (let i = 0; i < cols; i++) {
    dots[i] = [];
    for (let j = 0; j < rows; j++) {
      let x = margin + size / 2 + i * size;
      let y = margin + size / 2 + j * size;
      let distance = dist(x, y, width / 2, height / 2);
      let angle = map(distance, 0, width / 2, 0, TWO_PI * 3);
      dots[i][j] = new Dot(x, y, angle, speed, scl);
    }
  }
};

window.draw = () => {
  background("#022bdf");

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      dots[i][j].update();
      dots[i][j].display();
    }
  }
};
