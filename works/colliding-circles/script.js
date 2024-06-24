const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2,
};

let numberOfCircles;

const colours = [
  "#f4cd00",
  "#fa920d",
  "#e8441f",
  "#46c35b",
  "#3ba7ff",
  "#3d58e3",
  "#ce8f5f",
  "#e195bb",
  "#05d6f0",
  "#b29815",
  "#a0742c",
  "#fe5a01",
  "#ff7469",
  "#a44cd3",
  "#f1c40f",
  "#ffae42",
  "#228c22",
  "#e090df",
  "#ff2c2c",
  "#ffea00",
  "#e1c699",
  "#54ab1d",
];

addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  init();
});

const getShuffledArr = (arr) => {
  const newArr = arr.slice();
  for (let i = newArr.length - 1; i > 0; i--) {
    const rand = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
  }
  return newArr;
};

function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomColour(colours) {
  return colours[Math.floor(Math.random() * colours.length)];
}

function getDistance(x1, y1, x2, y2) {
  let xDistance = x2 - x1;
  let yDistance = y2 - y1;

  return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

function rotate(velocity, angle) {
  const rotatedVelocities = {
    x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
    y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle),
  };

  return rotatedVelocities;
}

function resolveCollision(particle, otherParticle) {
  const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
  const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

  const xDist = otherParticle.x - particle.x;
  const yDist = otherParticle.y - particle.y;

  if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
    const angle = -Math.atan2(
      otherParticle.y - particle.y,
      otherParticle.x - particle.x
    );

    const m1 = particle.mass;
    const m2 = otherParticle.mass;

    const u1 = rotate(particle.velocity, angle);
    const u2 = rotate(otherParticle.velocity, angle);

    const v1 = {
      x: (u1.x * (m1 - m2)) / (m1 + m2) + (u2.x * 2 * m2) / (m1 + m2),
      y: u1.y,
    };
    const v2 = {
      x: (u2.x * (m1 - m2)) / (m1 + m2) + (u1.x * 2 * m2) / (m1 + m2),
      y: u2.y,
    };

    const vFinal1 = rotate(v1, -angle);
    const vFinal2 = rotate(v2, -angle);

    particle.velocity.x = vFinal1.x;
    particle.velocity.y = vFinal1.y;
    particle.colours = getShuffledArr(colours);
    particle.numberOfCircles = randomIntFromRange(2, 5);
    particle.radiusToMinus = Array.from(
      { length: particle.numberOfCircles },
      (v, i) => {
        return randomIntFromRange(3, 15);
      }
    );

    otherParticle.velocity.x = vFinal2.x;
    otherParticle.velocity.y = vFinal2.y;
    otherParticle.colours = getShuffledArr(colours);
    otherParticle.numberOfCircles = randomIntFromRange(2, 5);
    otherParticle.radiusToMinus = Array.from(
      { length: otherParticle.numberOfCircles },
      (v, i) => {
        return randomIntFromRange(3, 15);
      }
    );
  }
}

function Particle(x, y, radius, colours, numberOfCircles, radiusToMinus) {
  this.x = x;
  this.y = y;
  this.velocity = {
    x: Math.random() - 0.5,
    y: Math.random() - 0.5,
  };
  this.radius = radius;
  this.colours = colours;
  this.mass = 1;
  this.numberOfCircles = numberOfCircles;
  this.radiusToMinus = radiusToMinus;

  this.update = (particles) => {
    this.draw();

    for (let i = 0; i < particles.length; i++) {
      if (this === particles[i]) continue;

      if (
        getDistance(this.x, this.y, particles[i].x, particles[i].y) -
          radius * 2 <
        0
      ) {
        resolveCollision(this, particles[i]);
      }
    }

    if (this.x - this.radius <= 0 || this.x + this.radius >= innerWidth) {
      this.velocity.x = -this.velocity.x;
    }

    if (this.y - this.radius <= 0 || this.y + this.radius >= innerHeight) {
      this.velocity.y = -this.velocity.y;
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;
  };

  this.draw = function () {
    let coloursCounter = 0;
    let radius = this.radius;

    for (let i = 0; i < this.numberOfCircles; i++) {
      c.beginPath();
      c.arc(this.x, this.y, radius, 0, Math.PI * 2, false);
      c.fillStyle = this.colours[coloursCounter];
      c.fill();
      c.closePath();
      radius -= this.radiusToMinus[i];
      if (radius < 0) {
        radius = 0;
      }
      coloursCounter += 1;
    }

    c.beginPath();
    c.arc(this.x, this.y, 20, 0, Math.PI * 2, false);
    c.fillStyle = "#f5f5f5";
    c.fill();
    c.closePath();
  };
}

let particles;

function init() {
  numberOfCircles = window.innerWidth > 600 ? 10 : 3;
  particles = [];

  for (let i = 0; i < numberOfCircles; i++) {
    const radius = 80;
    let x = randomIntFromRange(radius, canvas.width - radius);
    let y = randomIntFromRange(radius, canvas.height - radius);
    let shuffledColours = getShuffledArr(colours);
    let randomNumberOfCircles = randomIntFromRange(2, 5);
    let radiusToMinus = Array.from(
      { length: randomNumberOfCircles },
      (v, i) => {
        return randomIntFromRange(3, 15);
      }
    );

    if (i !== 0) {
      for (let j = 0; j < particles.length; j++) {
        if (
          getDistance(x, y, particles[j].x, particles[j].y) - radius * 2 <
          0
        ) {
          x = randomIntFromRange(radius, canvas.width - radius);
          y = randomIntFromRange(radius, canvas.height - radius);

          j = -1;
        }
      }
    }

    particles.push(
      new Particle(
        x,
        y,
        radius,
        shuffledColours,
        randomNumberOfCircles,
        radiusToMinus
      )
    );
  }
}

addEventListener("click", (event) => {
  let randomNumberOfCircles = randomIntFromRange(2, 5);

  particles.push(
    new Particle(
      event.clientX,
      event.clientY,
      80,
      getShuffledArr(colours),
      randomIntFromRange(2, 5),
      Array.from({ length: randomNumberOfCircles }, (v, i) => {
        return randomIntFromRange(3, 15);
      })
    )
  );
});

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((particle) => {
    particle.update(particles);
  });
}

init();
animate();
