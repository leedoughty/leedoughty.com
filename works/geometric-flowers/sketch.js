/* ---------------------------------------- sketch ---------------------------------------- */
/* ---------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------- */

const SHAPE_SIZE = 180;
const SIDES = 6;

const MARGIN = SHAPE_SIZE;
const COLUMNS = 10;
const ROWS = 10;
const PADDING = SHAPE_SIZE * 0.5;
const GRIDBOX = SHAPE_SIZE + PADDING;
const START = SHAPE_SIZE / 3 + MARGIN;

const NUM_SHAPES = 70;
const VELOCITY_RANGE = 1.5;

let PALETTE = [];
let ALL_SHAPES = [];
const COOLDOWN_TIME = 250;

window.setup = function () {
  createCanvas(windowWidth, windowHeight);

  PALETTE = [
    "#14a6ff",
    "#e8441f",
    "#ff6a00",
    "#f7a000",
    "#f4cd00",
    "#15ad03",
    "#1b82e6",
    "#6d5acf",
  ];

  for (let i = 0; i < NUM_SHAPES; i++) {
    const posX = random(SHAPE_SIZE, width - SHAPE_SIZE);
    const posY = random(-300, -100);
    const velocity = createVector(
      random(-VELOCITY_RANGE, VELOCITY_RANGE),
      random(-VELOCITY_RANGE, VELOCITY_RANGE)
    );
    const shape = makeShape({ x: posX, y: posY, velocity: velocity });
    ALL_SHAPES.push(shape);
  }

  noCursor();
  angleMode(DEGREES);
  rectMode(CENTER);
  frameRate(60);
  blendMode(LIGHTEST);
};

window.draw = function () {
  clear();
  background("#1b2b34");

  ALL_SHAPES.forEach((shape) => {
    shape.velocity.y += 0.01;

    shape.pos.add(shape.velocity);

    if (shape.pos.y > height + SHAPE_SIZE / 2) {
      const posX = random(SHAPE_SIZE, width - SHAPE_SIZE);
      const velocity = createVector(
        random(-VELOCITY_RANGE, VELOCITY_RANGE),
        random(-VELOCITY_RANGE, VELOCITY_RANGE)
      );

      shape.pos = createVector(
        posX + random(-20, 20),
        -SHAPE_SIZE + random(0, -700)
      );
      shape.velocity = velocity;
    }

    drawShape(shape);
  });
};

window.mousePressed = function () {
  const posX = mouseX;
  const posY = mouseY;
  const velocity = createVector(
    random(-VELOCITY_RANGE, VELOCITY_RANGE),
    random(-VELOCITY_RANGE, VELOCITY_RANGE)
  );
  const newShape = makeShape({ x: posX, y: posY, velocity: velocity });
  ALL_SHAPES.push(newShape);
};

/* ---------------------------------------- helpers ---------------------------------------- */
/* ---------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------- */

const pointOnCircle = (posX, posY, radius, angle) => {
  const x = posX + radius * cos(angle);
  const y = posY + radius * sin(angle);
  return createVector(x, y);
};

const randomSelectTwo = () => {
  const rando = random(1);
  return rando > 0.5 ? true : false;
};

const randomSelectThree = () => {
  const rando = random(1);
  if (rando < 1 / 3) {
    return "option1";
  } else if (rando < 2 / 3) {
    return "option2";
  } else {
    return "option3";
  }
};

const getRandomFromPalette = () => {
  const rando = floor(random(0, PALETTE.length));
  return PALETTE[rando];
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

const layerConstructors = [
  {
    name: "multiCircleShape",
    init: (props) =>
      multiCircleShape({
        ...props,
        ...setState(state),
      }),
    weight: 0.5,
  },
  {
    name: "circleOutlineThick",
    init: (props) =>
      circleOutlineThick({
        ...props,
        ...setState(state),
      }),
    weight: 0.5,
  },
  {
    name: "circleShape",
    init: (props) =>
      circleShape({
        ...props,
        ...setState(state),
      }),
    weight: 0.5,
  },
  {
    name: "linesRotatingAroundCenter",
    init: (props) =>
      linesRotatingAroundCenter({
        ...props,
        ...setState(state),
      }),
    weight: 0.5,
  },
  {
    name: "rotatedSquareWithInnerSquare",
    init: (props) =>
      rotatedSquareWithInnerSquare({
        ...props,
        ...setState(state),
      }),
    weight: 0.5,
  },
  {
    name: "octagonOutline",
    init: (props) =>
      octagonOutline({
        ...props,
        ...setState(state),
      }),
    weight: 0.5,
  },
  {
    name: "ringOfCirclesLarge",
    init: (props) =>
      ringOfCirclesLarge({
        ...props,
        ...setState(state),
      }),
    weight: 0.5,
  },
  {
    name: "circlesInAsteriskShape",
    init: (props) =>
      circlesInAsteriskShape({
        ...props,
        ...setState(state),
      }),
    weight: 0.5,
  },
  {
    name: "circleShapeLarge",
    init: (props) =>
      circleShapeLarge({
        ...props,
        ...setState(state),
      }),
    weight: 0.5,
  },
  {
    name: "fourPointedStar",
    init: (props) =>
      fourPointedStar({
        ...props,
        ...setState(state),
      }),
    weight: 0.5,
  },
  {
    name: "multiPointStar",
    init: (props) =>
      multiPointStar({
        ...props,
        ...setState(state),
      }),
    weight: 0.5,
  },
  {
    name: "multiCircleShapeFive",
    init: (props) =>
      multiCircleShapeFive({
        ...props,
        ...setState(state),
      }),
    weight: 0.5,
  },
  {
    name: "multiRoundedRectShape",
    init: (props) =>
      multiRoundedRectShape({
        ...props,
        ...setState(state),
      }),
    weight: 0.5,
  },
  {
    name: "multiRoundedRectShapeSmall",
    init: (props) =>
      multiRoundedRectShapeSmall({
        ...props,
        ...setState(state),
      }),
    weight: 0.5,
  },
];

function setLineDash(list) {
  drawingContext.setLineDash(list);
}

function shuffle(array) {
  const newArray = [...array];
  let currentIndex = newArray.length;

  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [newArray[currentIndex], newArray[randomIndex]] = [
      newArray[randomIndex],
      newArray[currentIndex],
    ];
  }

  return newArray;
}

const makeRandomShape = (pos) => {
  const shuffledLayers = shuffle([...layerConstructors]);
  let layers = shuffledLayers.slice(0, 2).map((lcon) =>
    lcon.init({
      pos,
      draw: true,
    })
  );
  return layers;
};

const makeShape = (props) => {
  return {
    pos: createVector(props.x, props.y),
    velocity: props.velocity,
    layers: makeRandomShape({ x: props.x, y: props.y }),
    lastShapeChange: -COOLDOWN_TIME,
  };
};

const drawShape = (shape) => {
  shape.layers.forEach((layer) => {
    if (layer.state.draw) {
      push();
      translate(shape.pos.x, shape.pos.y);
      layer.render();
      pop();
    }
  });
};

/* ---------------------------------------- shapes ---------------------------------------- */
/* ---------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------- */

const state = {
  sides: SIDES,
  stepsOut: 8,
  thinStroke: 2,
  thickStroke: 4,
};

const setState = (initialState) => {
  const newState = { ...initialState };
  newState.numShapes = newState.sides;
  newState.angle = 360 / newState.numShapes;
  newState.singleStep = SHAPE_SIZE / 2 / newState.stepsOut;
  newState.layerColor = getRandomFromPalette();
  newState.strokeColour = getRandomFromPalette();
  return newState;
};

const multiCircleShape = (state) => {
  state.strokeColour =
    state.strokeColour === state.layerColor
      ? getRandomFromPalette()
      : state.strokeColour;
  state.shapeSize = SHAPE_SIZE / 2;

  return {
    name: "multiCircleShape",
    state,
    render: () => {
      push();
      strokeWeight(state.thickStroke);
      stroke(state.strokeColour);
      fill(state.layerColor);
      ellipse(-state.shapeSize / 2, -state.shapeSize / 2, state.shapeSize);
      ellipse(state.shapeSize / 2, state.shapeSize / 2, state.shapeSize);
      ellipse(-state.shapeSize / 2, state.shapeSize / 2, state.shapeSize);
      ellipse(state.shapeSize / 2, -state.shapeSize / 2, state.shapeSize);
      pop();
    },
  };
};

const circleOutlineThick = (state) => {
  state.strokeColour =
    state.strokeColour === state.layerColor
      ? getRandomFromPalette()
      : state.strokeColour;
  state.shapeSize = SHAPE_SIZE / 2;
  state.cornerRadius = 20;
  state.weight = 20;

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

const circleShape = (state) => {
  return {
    name: "circleShape",
    state,
    render: () => {
      push();
      strokeWeight(state.thickStroke);
      stroke(state.strokeColour);
      fill(state.layerColor);
      ellipse(0, 0, SHAPE_SIZE / 2);
      pop();
    },
  };
};

const linesRotatingAroundCenter = (state) => {
  state.numSteps = state.stepsOut;
  state.step = SHAPE_SIZE / 6 / state.numSteps;
  state.start = 7;
  state.stop = 14;
  state.weight = 6;
  state.numShapes = 6;
  state.angle = 360 / state.numShapes;
  state.rotation = 0;
  state.circleShapeColour = getRandomFromPalette();
  state.circleShapeStroke = getRandomFromPalette();

  return {
    name: "linesRotatingAroundCenter",
    state,
    render: () => {
      push();
      rotate(state.rotation);
      fill(state.circleShapeColour);
      stroke(state.circleShapeStroke);
      circle(0, 0, SHAPE_SIZE);
      noFill();

      strokeWeight(state.weight * 2);
      stroke(state.strokeColour);
      for (let i = 0; i < state.numShapes; i++) {
        line(state.start * state.step, 0, state.stop * state.step, 0);
        rotate(state.angle);
      }

      strokeWeight(state.weight);
      stroke(state.layerColor);
      for (let i = 0; i < state.numShapes; i++) {
        line(state.start * state.step, 0, state.stop * state.step, 0);
        rotate(state.angle);
      }

      pop();
    },
    update: () => {
      state.rotation += 2;
    },
  };
};

const rotatedSquareWithInnerSquare = (state) => {
  state.strokeColour =
    state.strokeColour === state.layerColor
      ? getRandomFromPalette()
      : state.strokeColour;
  state.shapeSize = SHAPE_SIZE / 1.4;
  state.cornerRadius = 20;
  state.thickStroke = 8;

  return {
    name: "rotatedSquareWithInnerSquare",
    state,
    render: () => {
      push();
      fill(state.layerColor);
      rotate(45);
      strokeWeight(state.thickStroke);
      stroke(state.strokeColour);
      square(0, 0, state.shapeSize, state.cornerRadius);
      rotate(45);
      square(0, 0, state.shapeSize / 1.4, state.cornerRadius / 2);
      pop();
    },
  };
};

const octagonOutline = (state) => {
  state.strokeColour =
    state.strokeColour === state.layerColor
      ? getRandomFromPalette()
      : state.strokeColour;
  state.shapeSize = SHAPE_SIZE / 2.3;
  state.cornerRadius = 10;
  state.weight = 50;
  state.rotate = 22.5;

  return {
    name: "octagonOutline",
    state,
    render: () => {
      push();
      noFill();
      stroke(state.layerColor);
      strokeWeight(state.weight);
      strokeJoin(ROUND);
      rotate(state.rotate);
      octagon(0, 0, state.shapeSize);
      pop();
    },
  };
};

const ringOfCircles = (state) => {
  state.strokeColour =
    state.strokeColour === state.layerColor
      ? getRandomFromPalette()
      : state.strokeColour;
  state.steps = 5;
  state.center = state.steps * state.singleStep;
  state.direction = randomSelectTwo();

  state.radius = SHAPE_SIZE / 4;

  return {
    name: "ringOfCircles",
    state,
    render: () => {
      push();
      strokeWeight(3);
      stroke(state.strokeColour);
      fill(state.layerColor);
      for (let i = 0; i < state.numShapes; i++) {
        ellipse(0, state.center, state.radius, state.radius);
        rotate(state.angle);
      }
      pop();
    },
  };
};

const ringOfCirclesLarge = (state) => {
  state.steps = 5;
  state.center = state.steps * state.singleStep;
  state.direction = randomSelectTwo();
  state.radius = SHAPE_SIZE / 2;

  return {
    name: "ringOfCircles",
    state,
    render: () => {
      push();

      strokeWeight(state.thickStroke);
      stroke(state.strokeColour);
      fill(state.layerColor + "00");
      for (let i = 0; i < state.numShapes; i++) {
        ellipse(
          0,
          state.center,
          state.radius + state.thickStroke,
          state.radius + state.thickStroke
        );
        rotate(state.angle);
      }

      noStroke();
      fill(state.layerColor);
      for (let i = 0; i < state.numShapes; i++) {
        ellipse(0, state.center, state.radius, state.radius);
        rotate(state.angle);
      }

      pop();
    },
  };
};

const circlesInAsteriskShape = (state) => {
  state.strokeColour =
    state.strokeColour === state.layerColor
      ? getRandomFromPalette()
      : state.strokeColour;
  state.weight = 5;
  state.shapeSize = SHAPE_SIZE / 3;
  state.circleDiameter = 35;

  return {
    name: "asteriskShape",
    state,
    render: () => {
      push();
      const numLines = 3;
      const angle = 360 / numLines;

      noStroke();
      fill(state.strokeColour);
      for (let i = 0; i < numLines; i++) {
        circle(0, 0, state.circleDiameter + state.thickStroke);
        circle(
          0,
          -state.shapeSize / 2,
          state.circleDiameter + state.thickStroke * 2
        );
        circle(
          0,
          state.shapeSize / 2,
          state.circleDiameter + state.thickStroke * 2
        );
        rotate(angle);
      }

      noStroke();
      fill(state.layerColor);
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

const circleShapeLarge = (state) => {
  state.strokeColour =
    state.strokeColour === state.layerColor
      ? getRandomFromPalette()
      : state.strokeColour;
  state.shapeSize = SHAPE_SIZE;

  return {
    name: "circleShapeLarge",
    state,
    render: () => {
      push();
      fill(state.layerColor);
      strokeWeight(state.thickStroke);
      stroke(state.strokeColour);
      ellipse(0, 0, state.shapeSize, state.shapeSize);
      pop();
    },
  };
};

const fourPointedStar = (state) => {
  state.strokeColour =
    state.strokeColour === state.layerColor
      ? getRandomFromPalette()
      : state.strokeColour;
  state.radius = SHAPE_SIZE / 3;
  state.starPoints = 4;
  state.rotation = randomSelectTwo() ? 0 : 45;

  return {
    name: "fourPointedStar",
    state,
    render: () => {
      push();
      strokeWeight(5);
      strokeJoin(ROUND);
      strokeWeight(state.thickStroke);
      stroke(state.strokeColour);
      rotate(state.rotation);
      fill(state.layerColor);
      star(0, 0, state.radius / 3, state.radius, state.starPoints);
      pop();
    },
  };
};

const multiPointStar = (state) => {
  state.strokeColour =
    state.strokeColour === state.layerColor
      ? getRandomFromPalette()
      : state.strokeColour;
  state.shapeSize = SHAPE_SIZE / 10;
  state.radius = SHAPE_SIZE / 2;

  return {
    name: "multiPointStar",
    state,
    render: () => {
      push();
      strokeWeight(state.thickStroke);
      stroke(state.strokeColour);
      fill(state.layerColor);
      star(0, 0, state.radius / 1.5, state.radius, 12);
      pop();
    },
  };
};

const multiCircleShapeFive = (state) => {
  state.strokeColour =
    state.strokeColour === state.layerColor
      ? getRandomFromPalette()
      : state.strokeColour;

  return {
    name: "multiCircleShapeFive",
    state,
    render: () => {
      push();
      fill(state.strokeColour);
      noStroke();
      ellipse(0, 0, SHAPE_SIZE / 3 + state.thickStroke * 2);

      for (let i = 0; i < 5; i++) {
        const angle = -90 + i * 72;
        const x = cos(angle) * (SHAPE_SIZE / 4);
        const y = sin(angle) * (SHAPE_SIZE / 4);
        ellipse(x, y, SHAPE_SIZE / 2 + state.thickStroke * 2);
      }
      pop();

      push();
      noStroke();
      fill(state.layerColor);
      ellipse(0, 0, SHAPE_SIZE / 3);

      for (let i = 0; i < 5; i++) {
        const angle = -90 + i * 72;
        const x = cos(angle) * (SHAPE_SIZE / 4);
        const y = sin(angle) * (SHAPE_SIZE / 4);
        ellipse(x, y, SHAPE_SIZE / 2);
      }
      pop();
    },
  };
};

const linesRotatingAroundCenterSmall = (state) => {
  state.strokeColour =
    state.strokeColour === state.layerColor
      ? getRandomFromPalette()
      : state.strokeColour;
  state.numSteps = state.stepsOut;
  state.step = SHAPE_SIZE / 4 / state.numSteps;
  state.start = 6;
  state.stop = 12;
  state.weight = 4;
  state.numShapes = 6;
  state.angle = 360 / state.numShapes;
  state.offsetAngle = 360 / (2 * state.numShapes);
  state.progress = 45;
  state.rotationSpeed = 1;
  state.progressIncrement = 0.005;
  state.strokeColour =
    state.strokeColour === state.layerColor
      ? getRandomFromPalette()
      : state.strokeColour;
  return {
    name: "linesRotatingAroundCenterSmall",
    state,
    render: () => {
      push();
      rotate(state.offsetAngle);
      noFill();
      let visibleLines = floor(state.progress * state.numShapes);
      for (let i = 0; i < visibleLines; i++) {
        stroke(state.layerColor);
        strokeWeight(state.weight + 10);
        line(state.start * state.step, 0, state.stop * state.step, 0);
        rotate(state.angle);
      }
      pop();
    },
  };
};

const multiRoundedRectShape = (state) => {
  state.strokeColour =
    state.strokeColour === state.layerColor
      ? getRandomFromPalette()
      : state.strokeColour;

  return {
    name: "multiRoundedRectShape",
    state,
    render: () => {
      push();
      strokeWeight(state.thickStroke);
      stroke(state.strokeColour);
      fill(state.layerColor);
      let w = SHAPE_SIZE / 2;
      let h = SHAPE_SIZE / 2;
      let r = SHAPE_SIZE / 8;

      rect(-SHAPE_SIZE / 4, -SHAPE_SIZE / 4, w, h, r);
      rect(SHAPE_SIZE / 4, SHAPE_SIZE / 4, w, h, r);
      rect(-SHAPE_SIZE / 4, SHAPE_SIZE / 4, w, h, r);
      rect(SHAPE_SIZE / 4, -SHAPE_SIZE / 4, w, h, r);

      pop();
    },
  };
};

const multiRoundedRectShapeSmall = (state) => {
  state.strokeColour =
    state.strokeColour === state.layerColor
      ? getRandomFromPalette()
      : state.strokeColour;
  state.shapeSize = SHAPE_SIZE / 2;
  state.placement = 4;

  return {
    name: "multiRoundedRectShapeSmall",
    state,
    render: () => {
      push();
      strokeWeight(state.thickStroke);
      stroke(state.strokeColour);
      fill(state.layerColor);
      let w = state.shapeSize / 2;
      let h = state.shapeSize / 2;
      let r = state.shapeSize / 8;

      rect(
        -state.shapeSize / state.placement,
        -state.shapeSize / state.placement,
        w,
        h,
        r
      );
      rect(
        state.shapeSize / state.placement,
        state.shapeSize / state.placement,
        w,
        h,
        r
      );
      rect(
        -state.shapeSize / state.placement,
        state.shapeSize / state.placement,
        w,
        h,
        r
      );
      rect(
        state.shapeSize / state.placement,
        -state.shapeSize / state.placement,
        w,
        h,
        r
      );

      pop();
    },
  };
};
