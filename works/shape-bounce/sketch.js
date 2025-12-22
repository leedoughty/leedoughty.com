const SHAPE_SIZE = 70;
const SIDES = 6;
const MARGIN = SHAPE_SIZE / 2;

let columns;
let rows;
let spacingX;
let spacingY;

const PADDING = SHAPE_SIZE * 0.3;
const GRIDBOX = SHAPE_SIZE + PADDING;
const START = SHAPE_SIZE / 2 + MARGIN + 25;
const BACKGROUND_COLOUR = "#1b2b34";
let PALETTE = [];
let ALL_SHAPES = [];
const NUMBER_OF_SHAPES = 50;
const COLLISION_COOLDOWN = 1000;

const collisionHistory = {};

const SPEED_RANGE = { min: 0.8, max: 1.5 };
const BOUNCE_FACTOR = 0.001;

function initializeShapes() {
  ALL_SHAPES = [];
  for (let i = 0; i < NUMBER_OF_SHAPES; i++) {
    const posX = random(SHAPE_SIZE, width - SHAPE_SIZE);
    const posY = random(SHAPE_SIZE, height - SHAPE_SIZE);
    const shape = makeShape({ x: posX, y: posY });
    const angle = random(TWO_PI);
    const speed = random(SPEED_RANGE.min, SPEED_RANGE.max);
    shape.physics = {
      pos: { x: posX, y: posY },
      vel: { x: cos(angle) * speed, y: sin(angle) * speed },
      mass: random(1, 3),
      radius: SHAPE_SIZE / 2,
      id: i,
    };
    ALL_SHAPES.push(shape);
  }
}

window.setup = () => {
  createCanvas(windowWidth, windowHeight);

  PALETTE = [
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
    "#647582",
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
    "#3A5368",
    "#27475C",
    "#2D3E50",
    "#3F5A66",
  ];

  frameRate(60);
  angleMode(DEGREES);
  rectMode(CENTER);
  initializeShapes();
  blendMode(SCREEN);
};

window.draw = () => {
  clear();

  background(BACKGROUND_COLOUR);
  updatePhysics();

  ALL_SHAPES.forEach((shape) => {
    push();
    translate(shape.physics.pos.x, shape.physics.pos.y);
    shape.forEach((layer) => {
      if (layer.state.draw) {
        push();
        layer.render();
        pop();
      }
    });
    pop();
  });
};

function updatePhysics() {
  for (let i = 0; i < ALL_SHAPES.length; i++) {
    const shape = ALL_SHAPES[i];
    shape.physics.pos.x += shape.physics.vel.x;
    shape.physics.pos.y += shape.physics.vel.y;
    checkBoundaryCollision(shape);
    for (let j = i + 1; j < ALL_SHAPES.length; j++) {
      checkCollision(shape, ALL_SHAPES[j]);
    }
  }
}

function checkBoundaryCollision(shape) {
  const r = shape.physics.radius;
  if (shape.physics.pos.x <= r || shape.physics.pos.x >= width - r) {
    shape.physics.vel.x *= -1;
    shape.physics.pos.x = constrain(shape.physics.pos.x, r, width - r);
  }
  if (shape.physics.pos.y <= r || shape.physics.pos.y >= height - r) {
    shape.physics.vel.y *= -1;
    shape.physics.pos.y = constrain(shape.physics.pos.y, r, height - r);
  }
}

function checkCollision(shape1, shape2) {
  const dx = shape2.physics.pos.x - shape1.physics.pos.x;
  const dy = shape2.physics.pos.y - shape1.physics.pos.y;
  const distance = sqrt(dx * dx + dy * dy);
  const minDistance = shape1.physics.radius + shape2.physics.radius;

  const pairID = `${shape1.physics.id}-${shape2.physics.id}`;

  const currentTime = millis();

  if (!collisionHistory[pairID]) {
    collisionHistory[pairID] = 0;
  }

  if (distance < minDistance) {
    const angle = atan2(dy, dx);
    const targetX = shape1.physics.pos.x + cos(angle) * minDistance;
    const targetY = shape1.physics.pos.y + sin(angle) * minDistance;

    const ax = (targetX - shape2.physics.pos.x) * BOUNCE_FACTOR;
    const ay = (targetY - shape2.physics.pos.y) * BOUNCE_FACTOR;

    shape1.physics.vel.x -= (ax * shape2.physics.mass) / shape1.physics.mass;
    shape1.physics.vel.y -= (ay * shape2.physics.mass) / shape1.physics.mass;
    shape2.physics.vel.x += (ax * shape1.physics.mass) / shape2.physics.mass;
    shape2.physics.vel.y += (ay * shape1.physics.mass) / shape2.physics.mass;

    if (currentTime - collisionHistory[pairID] > COLLISION_COOLDOWN) {
      const newShapeLayers1 = makeShape({
        x: shape1.physics.pos.x,
        y: shape1.physics.pos.y,
      });
      const newShapeLayers2 = makeShape({
        x: shape2.physics.pos.x,
        y: shape2.physics.pos.y,
      });

      if (newShapeLayers1.length > 0) {
        shape1.length = 0;
        newShapeLayers1.forEach((layer) => shape1.push(layer));
      }

      if (newShapeLayers2.length > 0) {
        shape2.length = 0;
        newShapeLayers2.forEach((layer) => shape2.push(layer));
      }

      collisionHistory[pairID] = currentTime;
    }
  }
}

window.windowResized = () => {
  resizeCanvas(windowWidth, windowHeight);
  initializeShapes();
};

function star(x, y, radius1, radius2, npoints) {
  let angle = 360 / npoints;
  let halfAngle = angle / 2.0;
  beginShape();

  for (let a = 0; a < 360; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);

    let sx2 = x + cos(a + halfAngle) * radius1;
    let sy2 = y + sin(a + halfAngle) * radius1;
    vertex(sx2, sy2);
  }

  endShape(CLOSE);
}

const hexagon = (posX, posY, radius) => {
  const rotateAngle = 360 / 6;
  beginShape();
  for (let i = 0; i < 6; i++) {
    const thisVertex = pointOnCircle(posX, posY, radius, i * rotateAngle);
    vertex(thisVertex.x, thisVertex.y);
  }
  endShape(CLOSE);
};

const octagon = (posX, posY, radius) => {
  const rotateAngle = 360 / 8;
  beginShape();
  for (let i = 0; i < 8; i++) {
    const thisVertex = pointOnCircle(posX, posY, radius, i * rotateAngle);
    vertex(thisVertex.x, thisVertex.y);
  }
  endShape(CLOSE);
};

const pointOnCircle = (posX, posY, radius, angle) => {
  const x = posX + radius * cos(angle);
  const y = posY + radius * sin(angle);
  return createVector(x, y);
};

const randomSelectTwo = () => {
  const randomNumber = random(1);
  return randomNumber > 0.5 ? true : false;
};

const getRandomFromPalette = () => {
  const randomNumber = floor(random(0, PALETTE.length));
  return PALETTE[randomNumber];
};

const layerConstructors = [
  {
    name: "circleShapes",
    init: (props) =>
      circleShapes({
        ...props,
        ...setState(state),
      }),
    weight: 0.05,
  },
  {
    name: "concentricCircles",
    init: (props) =>
      concentricCircles({
        ...props,
        ...setState(state),
      }),
    weight: 0.05,
  },
  {
    name: "linesRotatingAroundCenter",
    init: (props) =>
      linesRotatingAroundCenter({
        ...props,
        ...setState(state),
      }),
    weight: 0.05,
  },
  {
    name: "parallelogram",
    init: (props) =>
      parallelogram({
        ...props,
        ...setState(state),
      }),
    weight: 0.05,
  },
  {
    name: "dashedCircularOutline",
    init: (props) =>
      dashedCircularOutline({
        ...props,
        ...setState(state),
      }),
    weight: 0.05,
  },
  {
    name: "circleOutlineThick",
    init: (props) =>
      circleOutlineThick({
        ...props,
        ...setState(state),
      }),
    weight: 0.05,
  },
  {
    name: "circleLarge",
    init: (props) =>
      circleLarge({
        ...props,
        ...setState(state),
      }),
    weight: 0.05,
  },
  {
    name: "fourPointedStar",
    init: (props) =>
      fourPointedStar({
        ...props,
        ...setState(state),
      }),
    weight: 0.05,
  },
  {
    name: "octagonOutline",
    init: (props) =>
      octagonOutline({
        ...props,
        ...setState(state),
      }),
    weight: 0.05,
  },
  {
    name: "asteriskShape",
    init: (props) =>
      asteriskShape({
        ...props,
        ...setState(state),
      }),
    weight: 0.05,
  },
  {
    name: "rotatedSquareWithInnerSquare",
    init: (props) =>
      rotatedSquareWithInnerSquare({
        ...props,
        ...setState(state),
      }),
    weight: 0.05,
  },
  {
    name: "multiPointStar",
    init: (props) =>
      multiPointStar({
        ...props,
        ...setState(state),
      }),
    weight: 0.05,
  },
  {
    name: "blockShapes",
    init: (props) =>
      blockShapes({
        ...props,
        ...setState(state),
      }),
    weight: 0.05,
  },
  {
    name: "multiCircleShape",
    init: (props) =>
      multiCircleShape({
        ...props,
        ...setState(state),
      }),
    weight: 0.05,
  },
  {
    name: "circlesInAsteriskShape",
    init: (props) =>
      circlesInAsteriskShape({
        ...props,
        ...setState(state),
      }),
    weight: 0.05,
  },
  {
    name: "multiRoundedRectShape",
    init: (props) =>
      multiRoundedRectShape({
        ...props,
        ...setState(state),
      }),
    weight: 0.05,
  },
  {
    name: "rectangularOutline",
    init: (props) =>
      rectangularOutline({
        ...props,
        ...setState(state),
      }),
    weight: 0.05,
  },
];

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
};

function setLineDash(list) {
  drawingContext.setLineDash(list);
}

const makeShape = (pos, targetY) => {
  shuffle(layerConstructors);

  let layers = layerConstructors.map((layerConstructor) => {
    return layerConstructor.init({
      pos,
      draw: true,
    });
  });

  const numShapesToDraw = random(3);
  // const numShapesToDraw = 1;

  if (layers.length > numShapesToDraw) {
    layers = layers.slice(0, numShapesToDraw);
  } else if (layers.length < numShapesToDraw) {
    const missingLayers = numShapesToDraw - layers.length;
    const extraLayers = layerConstructors.slice(0, missingLayers).map((lcon) =>
      lcon.init({
        pos,
        draw: true,
      })
    );

    layers = layers.concat(extraLayers);
  }

  return layers.map((layer) => ({
    ...layer,
    state: {
      ...layer.state,
      targetY: targetY,
    },
  }));
};

const drawShape = (shape) => {
  shape.forEach((layer) => {
    if (layer.state.draw && layer.render) {
      push();
      translate(layer.state.pos.x, layer.state.pos.y);
      layer.render();
      pop();
    }
  });
};

const state = {
  sides: SIDES,
  stepsOut: 8,
  thinStroke: 2,
  thickStroke: 10,
};

const setState = (state) => {
  (state.numShapes = state.sides),
    (state.angle = 360 / state.numShapes),
    (state.singleStep = SHAPE_SIZE / 2 / state.stepsOut),
    (state.layerColor = getRandomFromPalette());
  state.strokeColour = getRandomFromPalette();
  return state;
};

const circleShapes = (state) => {
  state.shapeSize = random(5, 15);
  state.spacing = random(15, 30);
  state.gridSize = random(2, 5);
  state.strokeColour =
    state.strokeColour === state.layerColor
      ? getRandomFromPalette()
      : state.strokeColour;

  return {
    name: "circleShapes",
    state,
    render: () => {
      push();
      translate(
        -((state.gridSize - 1) * state.spacing) / 2,
        -((state.gridSize - 1) * state.spacing) / 2
      );
      fill(state.layerColor);
      stroke(state.strokeColour);
      for (let i = 0; i < state.gridSize; i++) {
        for (let j = 0; j < state.gridSize; j++) {
          ellipse(
            j * state.spacing,
            i * state.spacing,
            state.shapeSize,
            state.shapeSize
          );
        }
      }
      pop();
    },
  };
};

const concentricCircles = (state) => {
  state.weight = 10;
  state.shapeSize = randomSelectTwo() ? SHAPE_SIZE / 1.5 : SHAPE_SIZE * 2;

  return {
    name: "concentricCircles",
    state,
    render: () => {
      push();
      stroke(state.layerColor);
      strokeWeight(state.weight);
      noFill();
      ellipse(0, 0, state.shapeSize);
      ellipse(0, 0, state.shapeSize / 1.5);
      ellipse(0, 0, state.shapeSize / 3);
      pop();
    },
  };
};

const linesRotatingAroundCenter = (state) => {
  state.numSteps = state.stepsOut;
  state.step = SHAPE_SIZE / 6 / state.numSteps;
  state.start = 7;
  state.stop = 14;
  state.weight = 5;
  state.numShapes = randomSelectTwo() ? 6 : 12;
  state.angle = 360 / state.numShapes;
  state.offsetAngle = 36 / 2;
  state.progress = 0;
  state.rotationSpeed = 1;
  state.progressIncrement = 0.005;
  state.strokeColour =
    state.strokeColour === state.layerColor
      ? getRandomFromPalette()
      : state.strokeColour;
  return {
    name: "linesRotatingAroundCenter",
    state,
    render: () => {
      push();
      rotate(state.offsetAngle);
      noFill();
      let visibleLines = floor(state.progress * state.numShapes);
      for (let i = 0; i < visibleLines; i++) {
        stroke(state.strokeColour);
        strokeWeight(state.weight);
        line(state.start * state.step, 0, state.stop * state.step, 0);
        rotate(state.angle);
      }
      pop();
    },
    update: () => {
      state.offsetAngle += state.rotationSpeed;

      if (state.progress < 1) {
        state.progress = state.progress + state.progressIncrement;
      } else {
        state.progress = 1;
      }
    },
  };
};

const parallelogram = (state) => {
  state.shapeSize = randomSelectTwo() ? SHAPE_SIZE / 2 : SHAPE_SIZE * 2;
  state.w = state.shapeSize * 0.9;
  state.h = state.shapeSize * 0.3;
  state.slant = state.shapeSize * 0.2;
  state.count = 1;
  state.spacing = state.h * 1.5;
  state.numOfShapes = 2;

  return {
    name: "parallelogram",
    state,
    render: () => {
      push();
      noStroke();
      fill(state.layerColor);
      translate(-state.slant / 2, 0);
      for (let i = 0; i < state.count; i++) {
        push();
        translate(0, i * state.spacing);
        quad(
          -state.w / 2 + state.slant,
          -state.h / 2,
          state.w / 2 + state.slant,
          -state.h / 2,
          state.w / 2,
          state.h / 2,
          -state.w / 2,
          state.h / 2
        );
        pop();
      }
      pop();
    },
    update: () => {
      if (state.count < state.numOfShapes) {
        state.count += 0.01;
      }
    },
  };
};

const dashedCircularOutline = (state) => {
  state.shapeSize = randomSelectTwo() ? SHAPE_SIZE / 1.5 : SHAPE_SIZE * 2;
  state.thickStroke = randomSelectTwo() ? 10 : 20;
  state.division = 1.25;
  state.rotation = 10;

  return {
    name: "dashedCircularOutline",
    state,
    render: () => {
      push();
      let circumference = PI * (state.shapeSize - state.thickStroke);
      let numDashes = 9;
      let dashLength = circumference / numDashes;
      rotate(state.rotation);
      setLineDash([dashLength, dashLength / 2]);
      noFill();
      strokeCap(SQUARE);
      stroke(state.layerColor);
      strokeWeight(state.thickStroke);
      circle(0, 0, state.shapeSize - state.thickStroke);
      pop();
    },
    update: () => {
      state.rotation += 1;
    },
  };
};

const circleOutlineThick = (state) => {
  state.shapeSize = randomSelectTwo() ? SHAPE_SIZE / 2 : SHAPE_SIZE * 1.2;
  state.cornerRadius = 5;
  state.weight = state.shapeSize === SHAPE_SIZE / 2 ? 10 : 5;

  return {
    name: "circleOutlineThick",
    state,
    render: () => {
      push();
      noFill();
      strokeWeight(state.weight);
      stroke(state.layerColor);
      circle(0, 0, state.shapeSize);
      pop();
    },
  };
};

const circleLarge = (state) => {
  state.shapeSize = random(30, 400);
  state.weight = 1;
  state.showStroke = randomSelectTwo();

  return {
    name: "circleLarge",
    state,
    render: () => {
      push();
      if (state.showStroke) {
        stroke(state.strokeColour);
        strokeWeight(5);
      } else {
        noStroke();
      }
      fill(state.layerColor);
      circle(0, 0, state.shapeSize);
      pop();
    },
  };
};

const fourPointedStar = (state) => {
  state.radius = randomSelectTwo() ? SHAPE_SIZE / 3 : SHAPE_SIZE / 2;
  state.starPoints = 4;

  return {
    name: "fourPointedStar",
    state,
    render: () => {
      push();
      strokeWeight(2);
      stroke(state.strokeColour);
      strokeJoin(ROUND);
      fill(state.layerColor);
      star(0, 0, state.radius / 3, state.radius, state.starPoints);
      pop();
    },
  };
};

const octagonOutline = (state) => {
  state.shapeSize = randomSelectTwo() ? SHAPE_SIZE / 3 : SHAPE_SIZE;
  state.weight = 3;
  state.rotate = 22.5;

  return {
    name: "octagonOutline",
    state,
    render: () => {
      push();
      fill(state.layerColor);
      strokeWeight(state.weight);
      stroke(state.strokeColour);
      rotate(state.rotate);
      octagon(0, 0, state.shapeSize);
      pop();
    },
  };
};

const asteriskShape = (state) => {
  state.weight = 2;
  state.shapeSize = randomSelectTwo() ? SHAPE_SIZE / 2 : SHAPE_SIZE;

  return {
    name: "asteriskShape",
    state,
    render: () => {
      push();
      stroke(state.layerColor);
      strokeWeight(state.weight);
      strokeCap(SQUARE);
      noFill();
      const numLines = 3;
      const angle = 360 / numLines;
      for (let i = 0; i < numLines; i++) {
        line(0, -state.shapeSize / 2, 0, state.shapeSize / 2);
        rotate(angle);
      }
      pop();
    },
  };
};

const rotatedSquareWithInnerSquare = (state) => {
  state.shapeSize = randomSelectTwo() ? SHAPE_SIZE / 1.4 : SHAPE_SIZE;
  state.cornerRadius = 10;
  state.thickStroke = 8;

  return {
    name: "rotatedSquareWithInnerSquare",
    state,
    render: () => {
      push();
      noFill();
      rotate(45);
      strokeWeight(state.thickStroke);
      stroke(state.layerColor);
      square(0, 0, state.shapeSize, state.cornerRadius);
      rotate(45);
      square(0, 0, state.shapeSize / 1.4, state.cornerRadius / 2);
      pop();
    },
  };
};

const multiPointStar = (state) => {
  state.shapeSize = randomSelectTwo() ? SHAPE_SIZE / 10 : SHAPE_SIZE / 5;
  state.radius = 20;

  return {
    name: "multiPointStar",
    state,
    render: () => {
      push();
      strokeWeight(1);
      strokeJoin(ROUND);
      stroke(state.layerColor);
      noFill();
      star(0, 0, state.radius / 1.5, state.radius, 8);
      pop();
    },
  };
};

const blockShapes = (state) => {
  state.shapeSize = random(10, 30);
  state.spacing = randomSelectTwo() ? 30 : 60;
  state.gridSizeX = random(2, 5);
  state.gridSizeY = random(2, 5);
  state.strokeColour =
    state.strokeColour === state.layerColor
      ? getRandomFromPalette()
      : state.strokeColour;

  return {
    name: "blockShapes",
    state,
    render: () => {
      push();
      translate(
        -((state.gridSizeX - 1) * state.spacing) / 2,
        -((state.gridSizeY - 1) * state.spacing) / 2
      );
      fill(state.layerColor);
      strokeWeight(3);
      stroke(state.strokeColour);
      for (let i = 0; i < state.gridSizeY; i++) {
        for (let j = 0; j < state.gridSizeX; j++) {
          rect(
            j * state.spacing,
            i * state.spacing,
            state.shapeSize,
            state.shapeSize
          );
        }
      }
      pop();
    },
  };
};

const multiCircleShape = (state) => {
  state.shapeSize = randomSelectTwo() ? SHAPE_SIZE : SHAPE_SIZE * 2;
  state.showStroke = randomSelectTwo();

  return {
    name: "multiCircleShape",
    state,
    render: () => {
      push();
      if (state.showStroke) {
        stroke(state.strokeColour);
        strokeWeight(3);
      } else {
        noStroke();
        fill(state.layerColor);
        ellipse(0, 0, state.shapeSize / 2);
      }
      fill(state.layerColor);
      ellipse(-state.shapeSize / 4, -state.shapeSize / 4, state.shapeSize / 2);
      ellipse(state.shapeSize / 4, state.shapeSize / 4, state.shapeSize / 2);
      ellipse(-state.shapeSize / 4, state.shapeSize / 4, state.shapeSize / 2);
      ellipse(state.shapeSize / 4, -state.shapeSize / 4, state.shapeSize / 2);
      pop();
    },
  };
};

const circlesInAsteriskShape = (state) => {
  state.weight = 5;
  state.shapeSize = SHAPE_SIZE / 2;
  state.circleDiameter = 25;

  return {
    name: "asteriskShape",
    state,
    render: () => {
      push();
      noStroke();
      fill(state.layerColor);
      const numLines = 3;
      const angle = 360 / numLines;
      for (let i = 0; i < numLines; i++) {
        circle(0, 0, state.circleDiameter);
        circle(0, -state.shapeSize / 2, state.circleDiameter);
        circle(0, state.shapeSize / 2, state.circleDiameter);
        rotate(angle);
      }
      pop();
    },
  };
};

const multiRoundedRectShape = (state) => {
  state.shapeSize = randomSelectTwo() ? SHAPE_SIZE : SHAPE_SIZE * 2;
  state.showStroke = randomSelectTwo();

  return {
    name: "multiRoundedRectShape",
    state,
    render: () => {
      push();
      if (state.showStroke) {
        stroke(state.strokeColour);
        strokeWeight(3);
      } else {
        noStroke();
      }
      fill(state.layerColor);
      let w = state.shapeSize / 2;
      let h = state.shapeSize / 2;
      let r = state.shapeSize / 8;

      rect(-state.shapeSize / 4, -state.shapeSize / 4, w, h, r);
      rect(state.shapeSize / 4, state.shapeSize / 4, w, h, r);
      rect(-state.shapeSize / 4, state.shapeSize / 4, w, h, r);
      rect(state.shapeSize / 4, -state.shapeSize / 4, w, h, r);

      pop();
    },
  };
};

const rectangularOutline = (state) => {
  state.shapeSize = randomSelectTwo() ? SHAPE_SIZE : SHAPE_SIZE * 3;
  state.thickStroke = 10;

  return {
    name: "rectangularOutline",
    state,
    render: () => {
      push();
      fill(state.layerColor);
      strokeWeight(state.thickStroke);
      stroke(state.strokeColour);
      rect(
        0,
        0,
        state.shapeSize - state.thickStroke,
        state.shapeSize - state.thickStroke
      );
      pop();
    },
  };
};
