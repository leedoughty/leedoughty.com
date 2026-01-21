const colours = [
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
  "#ff437f",
  "#ff8f35",
  "#4dc268",
  "#028ff5",
  "#ff99cc",
  "#22d3ee",
  "#15ad03",
  "#ff6347",
  "#9c27b0",
  "#ffec99",
  "#7fff00",
  "#0077b6",
  "#b983ff",
  "#fafafa",
  "#ffcc00",
  "#3ddc84",
  "#e6a6f5",
  "#ffdab9",
  "#4a90e2",
  "#ffead0",
  "#2196f3",
  "#d72638",
  "#ffeb3b",
  "#fa920d",
  "#f4cd00",
  "#3d58e3",
  "#e9e3d5",
];

class Ball {
  constructor(x, delay = 0) {
    this.x = x;
    this.y = -50 - delay;

    this.velocityY = 0;

    let vx = random(-6, 6);
    if (abs(vx) < 2) vx = vx < 0 ? -2 : 2;
    this.velocityX = vx;

    this.radius = random(60, 180);
    this.gravity = 0.6;
    this.damping = 0.75;

    this.squashAmount = 1;
    this.stretchAmount = 1;

    this.baseColor = color(random(colours));

    this.groundY = height + 100;
    this.active = delay === 0;
    this.delay = delay;

    this.trail = [];
    this.trailLength = 15;
  }

  update() {
    if (!this.active) {
      this.delay--;
      if (this.delay <= 0) this.active = true;
      return;
    }

    this.trail.push({
      x: this.x,
      y: this.y,
      squash: this.squashAmount,
      stretch: this.stretchAmount,
    });

    if (this.trail.length > this.trailLength) {
      this.trail.shift();
    }

    this.velocityY += this.gravity;
    this.y += this.velocityY;
    this.x += this.velocityX;

    if (this.y + this.radius > this.groundY && this.velocityY > 0) {
      this.y = this.groundY - this.radius;
      this.velocityY = -this.velocityY * this.damping;

      this.squashAmount = 1.6;
      this.stretchAmount = 0.4;

      if (abs(this.velocityY) < 0.8) {
        this.velocityY = 0;
      }
    } else {
      let speedFactor = abs(this.velocityY) / 15;

      if (this.velocityY > 0) {
        this.stretchAmount = lerp(
          this.stretchAmount,
          1 + speedFactor * 0.4,
          0.2,
        );
        this.squashAmount = lerp(
          this.squashAmount,
          1 - speedFactor * 0.25,
          0.2,
        );
      } else {
        this.stretchAmount = lerp(
          this.stretchAmount,
          1 - speedFactor * 0.2,
          0.2,
        );
        this.squashAmount = lerp(
          this.squashAmount,
          1 + speedFactor * 0.15,
          0.2,
        );
      }
    }

    this.squashAmount = lerp(this.squashAmount, 1, 0.12);
    this.stretchAmount = lerp(this.stretchAmount, 1, 0.12);

    if (this.y > height + 200 || this.x < -200 || this.x > width + 200) {
      this.reset();
    }
  }

  reset() {
    this.y = random(-300, -50);
    this.x = random(this.radius, width - this.radius);
    this.velocityY = 0;

    let vx = random(-6, 6);
    if (abs(vx) < 2) vx = vx < 0 ? -2 : 2;
    this.velocityX = vx;

    this.baseColor = color(random(colours));
    this.trail = [];
    this.active = true;
    this.delay = 0;
  }

  display() {
    if (!this.active) return;

    noStroke();

    for (let i = 0; i < this.trail.length; i++) {
      let ratio = i / this.trail.length;
      let alpha = ratio * 80;

      let c = color(this.baseColor);
      c.setAlpha(alpha);

      let t = this.trail[i];
      push();
      translate(t.x, t.y);
      scale(t.squash, t.stretch);
      fill(c);
      rect(0, 0, this.radius * 2);
      pop();
    }

    push();
    translate(this.x, this.y);
    scale(this.squashAmount, this.stretchAmount);

    let glow = color(this.baseColor);
    glow.setAlpha(40);
    fill(glow);
    rect(0, 0, this.radius * 1.5);

    pop();
  }
}

let balls = [];

window.setup = () => {
  createCanvas(windowWidth, windowHeight);
  background("#14202b");

  for (let i = 0; i < 8; i++) {
    balls.push(new Ball(random(100, width - 100), i * 25));
  }
};

window.draw = () => {
  for (let ball of balls) {
    ball.update();
    ball.display();
  }
};

window.mousePressed = () => {
  balls.push(new Ball(mouseX));
};

window.windowResized = () => {
  resizeCanvas(windowWidth, windowHeight);
  for (let b of balls) b.groundY = height;
};
