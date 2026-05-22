/* ---------------------------------------- sketch ---------------------------------------- */
/* ---------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------- */

const SHAPE_SIZE = 150;
const SIDES = 6;

const MARGIN = SHAPE_SIZE / 2;
const PADDING = SHAPE_SIZE * 0.3;
const GRIDBOX = SHAPE_SIZE + PADDING;
const BORDER_WIDTH = 50;
let COLUMNS, ROWS, spacingX, spacingY;
const START = 130;
const BACKGROUND_COLOUR = "#efefe3";

let lastUpdateTime = 0;
const updateInterval = 5000;

let PALETTE = [];
let ALL_SHAPES = [];

window.setup = function () {
  createCanvas(windowWidth, windowHeight);

  PALETTE = [
    "#e75397",
    "#01b2e8",
    "#ffec00",
    "#25a33d",
    "#f9b814",
    "#e53d1e",
    "#9A7EE8",
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
    "#ecebe9",
    "#15ad03",
    "#02bdfd",
    "#ce8f5f",
    "#e67e22",
    "#ffbf00",
    "#028ff5",
    "#9b59b6",
    "#fe2f03",
    "#e195bb",
    "#fb4a70",
    "#e7db00",
    "#ff7469",
    "#dc2828",
    "#fff017",
  ];

  angleMode(DEGREES);
  rectMode(CENTER);
  blendMode(SCREEN);
  calculateGrid(BORDER_WIDTH);

  ALL_SHAPES = [];
  for (let x = 0; x < COLUMNS; x++) {
    for (let y = 0; y < ROWS; y++) {
      const posX = BORDER_WIDTH + spacingX * (x + 0.5);
      const posY = BORDER_WIDTH + spacingY * (y + 0.5);
      const shape = makeShape({ x: posX, y: posY });
      ALL_SHAPES.push(shape);
    }
  }
};

window.draw = function () {
  clear();
  background("#1b2b34");

  let currentTime = millis();
  if (currentTime - lastUpdateTime > updateInterval) {
    lastUpdateTime = currentTime;
    ALL_SHAPES = [];
    for (let x = 0; x < COLUMNS; x++) {
      for (let y = 0; y < ROWS; y++) {
        const posX = BORDER_WIDTH + spacingX * (x + 0.5);
        const posY = BORDER_WIDTH + spacingY * (y + 0.5);
        const shape = makeShape({ x: posX, y: posY });
        ALL_SHAPES.push(shape);
      }
    }
  }

  ALL_SHAPES.forEach((shape) => {
    shape.forEach((layer) => {
      if (layer.state.draw) {
        push();
        translate(layer.state.pos.x, layer.state.pos.y);
        if (layer.update) {
          layer.update();
        }
        layer.render();
        pop();
      }
    });
  });
};

function calculateGrid(borderWidth) {
  const availableWidth = width - borderWidth * 2;
  const availableHeight = height - borderWidth * 2;

  COLUMNS = Math.floor(availableWidth / GRIDBOX);
  ROWS = Math.floor(availableHeight / GRIDBOX);

  spacingX = availableWidth / COLUMNS;
  spacingY = availableHeight / ROWS;
}

window.windowResized = function () {
  resizeCanvas(windowWidth, windowHeight);
  calculateGrid(BORDER_WIDTH);
  // Recreate shapes for new grid
  ALL_SHAPES = [];
  for (let x = 0; x < COLUMNS; x++) {
    for (let y = 0; y < ROWS; y++) {
      const posX = BORDER_WIDTH + spacingX * (x + 0.5);
      const posY = BORDER_WIDTH + spacingY * (y + 0.5);
      const shape = makeShape({ x: posX, y: posY });
      ALL_SHAPES.push(shape);
    }
  }
};

/* ---------------------------------------- helpers ---------------------------------------- */
/* ---------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------- */

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
  // Existing shapes
  {
    name: "circleOutlineShape",
    init: (props) => circleOutlineShape({ ...props, ...setState(state) }),
    weight: 0.5,
  },
  {
    name: "doubleCircularOutline",
    init: (props) => doubleCircularOutline({ ...props, ...setState(state) }),
    weight: 0.5,
  },
  {
    name: "dashedCircularOutline",
    init: (props) => dashedCircularOutline({ ...props, ...setState(state) }),
    weight: 0.5,
  },
  {
    name: "asteriskShape",
    init: (props) => asteriskShape({ ...props, ...setState(state) }),
    weight: 0.5,
  },
  {
    name: "rotatedSquareWithInnerSquare",
    init: (props) =>
      rotatedSquareWithInnerSquare({ ...props, ...setState(state) }),
    weight: 0.5,
  },
  {
    name: "asteriskSmall",
    init: (props) => asteriskSmall({ ...props, ...setState(state) }),
    weight: 0.5,
  },
  {
    name: "circlesInAsteriskShape",
    init: (props) => circlesInAsteriskShape({ ...props, ...setState(state) }),
    weight: 0.5,
  },
  {
    name: "octagonOutline",
    init: (props) => octagonOutline({ ...props, ...setState(state) }),
    weight: 0.5,
  },
  {
    name: "circleOutlineThick",
    init: (props) => circleOutlineThick({ ...props, ...setState(state) }),
    weight: 0.5,
  },
  {
    name: "multiPointStar",
    init: (props) => multiPointStar({ ...props, ...setState(state) }),
    weight: 0.5,
  },
  {
    name: "doubleCircleShape",
    init: (props) => doubleCircleShape({ ...props, ...setState(state) }),
    weight: 0.5,
  },
  {
    name: "linesRotatingAroundCenter",
    init: (props) =>
      linesRotatingAroundCenter({ ...props, ...setState(state) }),
    weight: 0.5,
  },
  {
    name: "outlineCirclesShape",
    init: (props) => outlineCirclesShape({ ...props, ...setState(state) }),
    weight: 0.5,
  },
  {
    name: "rotatedRoundedShape",
    init: (props) => rotatedRoundedShape({ ...props, ...setState(state) }),
    weight: 0.5,
  },
  {
    name: "manyLinesRotatingAroundCenter",
    init: (props) =>
      manyLinesRotatingAroundCenter({ ...props, ...setState(state) }),
    weight: 0.5,
  },
  // {
  //   name: "asteriskOutlineShape",
  //   init: (props) => asteriskOutlineShape({ ...props, ...setState(state) }),
  //   weight: 0.5,
  // },
  {
    name: "concentricCircleRoundedRect",
    init: (props) =>
      concentricCircleRoundedRect({ ...props, ...setState(state) }),
    weight: 0.5,
  },
  {
    name: "concentricCircles",
    init: (props) => concentricCircles({ ...props, ...setState(state) }),
    weight: 0.8,
  },
  {
    name: "rectangularOutline",
    init: (props) => rectangularOutline({ ...props, ...setState(state) }),
    weight: 0.8,
  },
  {
    name: "arcCircle",
    init: (props) => arcCircle({ ...props, ...setState(state) }),
    weight: 0.8,
  },
  {
    name: "crossShape",
    init: (props) => crossShape({ ...props, ...setState(state) }),
    weight: 0.8,
  },
  {
    name: "diagonalCrossShape",
    init: (props) => diagonalCrossShape({ ...props, ...setState(state) }),
    weight: 0.8,
  },
  {
    name: "multiCircleShape",
    init: (props) => multiCircleShape({ ...props, ...setState(state) }),
    weight: 0.5,
  },
  {
    name: "ringOfShapes",
    init: (props) => ringOfShapes({ ...props, ...setState(state) }),
    weight: 0.5,
  },
  // New shapes from shape-work-76
  {
    name: "circleShapes",
    init: (props) => circleShapes({ ...props, ...setState(state) }),
    weight: 0.2,
  },
  {
    name: "parallelogram",
    init: (props) => parallelogram({ ...props, ...setState(state) }),
    weight: 0.2,
  },
  {
    name: "circleLarge",
    init: (props) => circleLarge({ ...props, ...setState(state) }),
    weight: 0.2,
  },
  {
    name: "fourPointedStar",
    init: (props) => fourPointedStar({ ...props, ...setState(state) }),
    weight: 0.2,
  },
  {
    name: "blockShapes",
    init: (props) => blockShapes({ ...props, ...setState(state) }),
    weight: 0.2,
  },
  {
    name: "multiRoundedRectShape",
    init: (props) => multiRoundedRectShape({ ...props, ...setState(state) }),
    weight: 0.2,
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

const makeShape = (pos) => {
  shuffle(layerConstructors);

  let layers = layerConstructors.map((layerConstructor) => {
    const draw = random(1) > layerConstructor.weight;
    return layerConstructor.init({
      pos,
      draw,
    });
  });

  layers = layers.filter((layer) => layer.state.draw);

  const numShapesToDraw = floor(random(2, 4));

  if (layers.length > numShapesToDraw) {
    layers = layers.slice(0, numShapesToDraw);
  } else if (layers.length < numShapesToDraw) {
    const missingLayers = numShapesToDraw - layers.length;
    const extraLayers = layerConstructors.slice(0, missingLayers).map((lcon) =>
      lcon.init({
        pos,
        draw: true,
      }),
    );
  }

  return layers;
};

const drawShape = (shape) => {
  shape.forEach((layer) => {
    if (layer.state.draw) {
      push();
      translate(layer.state.pos.x, layer.state.pos.y);
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
  thickStroke: 10,
};

const setState = (state) => {
  ((state.numShapes = state.sides),
    (state.angle = 360 / state.numShapes),
    (state.singleStep = SHAPE_SIZE / 2 / state.stepsOut),
    (state.layerColor = getRandomFromPalette()));
  return state;
};

const circleOutlineShape = (state) => {
  state.shapeSize = SHAPE_SIZE;
  state.weight = 10;
  state.growth = 1;
  state.growthDirection = 1;

  return {
    name: "circleShape",
    state,
    render: () => {
      push();
      noFill();
      strokeWeight(state.weight);
      stroke(state.layerColor);
      circle(0, 0, state.shapeSize * (state.growth / 1.5) - state.weight);
      pop();
    },
    update: () => {
      if (state.growth >= 2) {
        state.growthDirection = -1;
      } else if (state.growth <= 0.5) {
        state.growthDirection = 1;
      }

      state.growth += 0.02 * state.growthDirection;
    },
  };
};

const doubleCircularOutline = (state) => {
  state.shapeSize = SHAPE_SIZE;
  state.thickStroke = 10;
  state.division = 1.25;
  state.growth = 1;
  state.growthDirection = 1;

  return {
    name: "doubleCircularOutline",
    state,
    render: () => {
      push();
      noFill();
      strokeWeight(state.thickStroke);
      stroke(state.layerColor);
      ellipse(
        0,
        0,
        state.shapeSize * state.growth - state.thickStroke,
        state.shapeSize * state.growth - state.thickStroke,
      );
      ellipse(
        0,
        0,
        state.shapeSize / state.division - state.thickStroke,
        state.shapeSize / state.division - state.thickStroke,
      );
      pop();
    },
    update: () => {
      if (state.growth >= 1.5) {
        state.growthDirection = -1;
      } else if (state.growth <= 0.5) {
        state.growthDirection = 1;
      }

      state.growth += 0.02 * state.growthDirection;
    },
  };
};

const dashedCircularOutline = (state) => {
  state.shapeSize = SHAPE_SIZE;
  state.thickStroke = 10;
  state.division = 1.25;
  state.rotation = 0;

  return {
    name: "dashedCircularOutline",
    state,
    render: () => {
      push();
      let circumference = PI * (state.shapeSize - state.thickStroke);
      let numDashes = 9;
      let dashLength = circumference / numDashes;
      rotate(-state.rotation);
      setLineDash([dashLength, dashLength / 2]);
      noFill();
      strokeCap(SQUARE);
      stroke(state.layerColor);
      strokeWeight(state.thickStroke);
      circle(0, 0, state.shapeSize - state.thickStroke);
      pop();
    },
    update: () => {
      state.rotation += 2.2;
    },
  };
};

const asteriskShape = (state) => {
  state.weight = 6;
  state.shapeSize = SHAPE_SIZE;
  state.growthDirection = 1;

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
    update: () => {
      state.weight += 0.5 * state.growthDirection;
      if (state.weight >= 18 || state.weight <= 6) {
        state.growthDirection *= -1;
      }
    },
  };
};

const rotatedSquareWithInnerSquare = (state) => {
  state.shapeSize = SHAPE_SIZE / 1.4;
  state.cornerRadius = 20;
  state.thickStroke = 8;
  state.rotation = 0;

  return {
    name: "rotatedSquareWithInnerSquare",
    state,
    render: () => {
      push();
      noFill();
      rotate(-state.rotation);
      strokeWeight(state.thickStroke);
      stroke(state.layerColor);
      square(0, 0, state.shapeSize, state.cornerRadius);
      rotate(45);
      square(0, 0, state.shapeSize / 1.4, state.cornerRadius / 2);
      pop();
    },
    update: () => {
      state.rotation += 2.2;
    },
  };
};

const asteriskSmall = (state) => {
  state.weight = 5;
  state.shapeSize = SHAPE_SIZE / 2;
  state.rotation = 0;

  return {
    name: "asteriskSmall",
    state,
    render: () => {
      push();
      stroke(state.layerColor);
      strokeWeight(state.weight);
      noFill();
      rotate(state.rotation);
      rotate(90);
      const numLines = 3;
      const angle = 360 / numLines;
      for (let i = 0; i < numLines; i++) {
        line(0, -state.shapeSize / 2, 0, state.shapeSize / 2);
        rotate(angle);
      }
      pop();
    },
    update: () => {
      state.rotation += 2;
    },
  };
};

const circlesInAsteriskShape = (state) => {
  state.weight = 5;
  state.shapeSize = SHAPE_SIZE / 1.25;
  state.circleDiameter = 45;
  state.currentStep = 0;
  state.growthDirection = 1;

  return {
    name: "asteriskShape",
    state,
    render: () => {
      push();
      noStroke();
      fill(state.layerColor);
      const numLines = 3;
      const angle = 360 / numLines;
      for (let i = 0; i < state.currentStep; i++) {
        circle(0, 0, state.circleDiameter);
        circle(0, -state.shapeSize / 2, state.circleDiameter);
        circle(0, state.shapeSize / 2, state.circleDiameter);
        rotate(angle);
      }
      pop();
    },
    update: () => {
      state.currentStep += 0.05 * state.growthDirection;
      if (state.currentStep >= 2.9) {
        state.growthDirection = -1;
      } else if (state.currentStep <= 0.1) {
        state.growthDirection = 1;
      }
    },
  };
};

const octagonOutline = (state) => {
  state.shapeSize = SHAPE_SIZE / 2.3;
  state.cornerRadius = 10;
  state.weight = 30;
  state.rotate = 22.5;
  state.growthDirection = 1;

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
    update: () => {
      state.weight += 0.5 * state.growthDirection;
      if (state.weight >= 80 || state.weight <= 30) {
        state.growthDirection *= -1;
      }
    },
  };
};

const circleOutlineThick = (state) => {
  state.shapeSize = SHAPE_SIZE / 2;
  state.cornerRadius = 20;
  state.weight = 30;
  state.growthDirection = 1;

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
    update: () => {
      state.weight += 0.5 * state.growthDirection;
      if (state.weight >= 80 || state.weight <= 30) {
        state.growthDirection *= -1;
      }
    },
  };
};

const multiPointStar = (state) => {
  state.shapeSize = SHAPE_SIZE / 2;
  state.radius = SHAPE_SIZE / 3;
  state.numPoints = 12;
  state.growth = 1;
  state.growthDirection = 1;

  return {
    name: "multiPointStar",
    state,
    render: () => {
      push();
      strokeWeight(5);
      strokeJoin(ROUND);
      stroke(state.layerColor);
      noFill();
      star(
        0,
        0,
        (state.radius / 1.5) * state.growth,
        state.radius * state.growth,
        state.numPoints,
      );
      pop();
    },
    update: () => {
      if (state.growth >= 2) {
        state.growthDirection = -1;
      } else if (state.growth <= 1) {
        state.growthDirection = 1;
      }

      state.growth += 0.02 * state.growthDirection;
    },
  };
};

const doubleCircleShape = (state) => {
  state.shapeSize = SHAPE_SIZE;
  state.weight = 10;
  state.growthDirection = 1;

  return {
    name: "doubleCircleShape",
    state,
    render: () => {
      push();
      noFill();
      strokeWeight(state.weight);
      stroke(state.layerColor);
      circle(0, 0, state.shapeSize - state.weight);

      push();
      fill(state.layerColor);
      noStroke();
      circle(0, 0, state.shapeSize / 3);
      pop();

      pop();
    },
    update: () => {
      state.weight += 0.5 * state.growthDirection;
      if (state.weight >= 50 || state.weight <= 10) {
        state.growthDirection *= -1;
      }
    },
  };
};

const linesRotatingAroundCenter = (state) => {
  state.numSteps = state.stepsOut;
  state.step = SHAPE_SIZE / 4 / state.numSteps;
  state.start = 7;
  state.stop = 14;
  state.weight = 8;
  state.numShapes = 10;
  state.angle = 360 / state.numShapes;
  state.offsetAngle = 36 / 2;
  state.rotation = 0;

  return {
    name: "linesRotatingAroundCenter",
    state,
    render: () => {
      push();
      rotate(state.rotation);
      noFill();
      stroke(state.layerColor);
      strokeWeight(state.weight);
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

const outlineCirclesShape = (state) => {
  state.shapeSize = SHAPE_SIZE - 10;
  state.weight = 3;
  state.offset = 0;
  state.offsetDirection = 1;
  state.offsetSpeed = 0.5;
  state.maxOffset = 20;

  return {
    name: "outlineCirclesShape",
    state,
    render: () => {
      push();
      noFill();
      stroke(state.layerColor);
      strokeWeight(state.weight);

      for (let i = 0; i < 5; i++) {
        circle(0, state.offset * i, state.shapeSize);
      }

      pop();
    },
    update: () => {
      if (state.offset >= state.maxOffset) {
        state.offsetDirection = -1;
      } else if (state.offset <= 0) {
        state.offsetDirection = 1;
      }
      state.offset += state.offsetSpeed * state.offsetDirection;
    },
  };
};

const rotatedRoundedShape = (state) => {
  state.shapeSize = SHAPE_SIZE - 10;
  state.weight = 3;
  state.rotation = 0;

  return {
    name: "circleShape",
    state,
    render: () => {
      push();
      noStroke();
      rotate(state.rotation);
      strokeWeight(state.weight);
      fill(state.layerColor);
      for (let i = 0; i < 4; i++) {
        rotate(45);
        rect(0, 0, state.shapeSize / 2, state.shapeSize, 30);
      }
      pop();
    },
    update: () => {
      state.rotation += 1.2;
    },
  };
};

const manyLinesRotatingAroundCenter = (state) => {
  state.numSteps = state.stepsOut;
  state.step = SHAPE_SIZE / 4 / state.numSteps;
  state.start = 7;
  state.stop = 14;
  state.weight = 8;
  state.numShapes = 20;
  state.angle = 360 / state.numShapes;
  state.offsetAngle = 36 / 2;
  state.rotation = 0;

  return {
    name: "manyLinesRotatingAroundCenter",
    state,
    render: () => {
      push();
      rotate(state.rotation);
      noFill();
      strokeCap(SQUARE);
      stroke(state.layerColor);
      strokeWeight(state.weight);
      for (let i = 0; i < state.numShapes; i++) {
        line(state.start * state.step, 0, state.stop * state.step, 0);
        rotate(state.angle);
      }
      pop();
    },
    update: () => {
      state.rotation += 3;
    },
  };
};

const asteriskOutlineShape = (state) => {
  state.weight = 2;
  state.shapeSize = SHAPE_SIZE;
  state.growthDirection = 1;
  state.maxSize = SHAPE_SIZE;
  state.minSize = SHAPE_SIZE / 4;
  state.growthRate = 1;

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
        rect(0, 0, 10, state.shapeSize);
        rotate(angle);
      }
      pop();
    },
    update: () => {
      state.shapeSize += state.growthRate * state.growthDirection;
      if (
        state.shapeSize >= state.maxSize ||
        state.shapeSize <= state.minSize
      ) {
        state.growthDirection *= -1;
      }
    },
  };
};

const concentricCircleRoundedRect = (state) => {
  state.shapeSize = SHAPE_SIZE;
  state.weight = 5;
  state.triangleSize = state.shapeSize / 2;
  state.circleDivideBy = 1.5;
  state.growthDirection = 1;

  return {
    name: "concentricCircleTriangle",
    state,
    render: () => {
      push();
      stroke(state.layerColor);
      strokeWeight(state.weight);
      noFill();

      strokeJoin(ROUND);
      circle(0, 0, state.shapeSize);
      rect(0, 0, state.shapeSize / 1.5, state.shapeSize / 1.5, 15);

      pop();
    },
    update: () => {
      state.weight += 0.5 * state.growthDirection;
      if (state.weight >= 20 || state.weight <= 5) {
        state.growthDirection *= -1;
      }
    },
  };
};

const concentricCircles = (state) => {
  state.weight = state.thinStroke;
  state.shapeSize = SHAPE_SIZE - state.weight;
  state.growthDirection = 1;
  state.thickStroke = 20;

  return {
    name: "Concentric circles",
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
    update: () => {
      state.weight += 0.1 * state.growthDirection;
      if (state.weight >= state.thickStroke) {
        state.growthDirection = -1;
      } else if (state.weight <= state.thinStroke) {
        state.growthDirection = 1;
      }
      state.shapeSize = SHAPE_SIZE - state.weight;
    },
  };
};

const rectangularOutline = (state) => {
  state.shapeSize = SHAPE_SIZE;
  state.thickStroke = 10;
  state.weight = 10;
  state.growthDirection = 1;

  return {
    name: "rectangularOutline",
    state,
    render: () => {
      push();
      noFill();
      strokeWeight(state.weight);
      stroke(state.layerColor);
      rect(
        0,
        0,
        state.shapeSize - state.thickStroke,
        state.shapeSize - state.thickStroke,
      );
      pop();
    },
    update: () => {
      state.weight += 0.5 * state.growthDirection;
      if (state.weight >= 20 || state.weight <= 10) {
        state.growthDirection *= -1;
      }
    },
  };
};

const arcCircle = (state) => {
  state.arcTopLeftOrBottomRight = randomSelectTwo();
  state.rotation = 0;

  return {
    name: "arcCircle",
    state,
    render: () => {
      push();
      fill(state.layerColor);
      rotate(state.rotation);
      noStroke();
      if (state.arcTopLeftOrBottomRight) {
        arc(0, 0, SHAPE_SIZE, SHAPE_SIZE, 180, 270, PIE);
        arc(0, 0, SHAPE_SIZE, SHAPE_SIZE, 0, 90, PIE);
      } else {
        arc(0, 0, SHAPE_SIZE, SHAPE_SIZE, 270, 360, PIE);
        arc(0, 0, SHAPE_SIZE, SHAPE_SIZE, 90, 180, PIE);
      }
      pop();
    },
    update: () => {
      state.rotation += 2;
    },
  };
};

const crossShape = (state) => {
  state.weight = randomSelectTwo() ? state.thinStroke : state.thickStroke;
  state.divideBySize = 6;
  state.rotation = 0;

  return {
    name: "crossShape",
    state,
    render: () => {
      push();
      fill(state.layerColor);
      rotate(state.rotation);
      noStroke();
      rect(0, 0, SHAPE_SIZE / state.divideBySize, SHAPE_SIZE);
      rect(0, 0, SHAPE_SIZE, SHAPE_SIZE / state.divideBySize);
      pop();
    },
    update: () => {
      state.rotation += 1.6;
    },
  };
};

const diagonalCrossShape = (state) => {
  state.weight = randomSelectTwo() ? state.thinStroke : state.thickStroke;
  state.divideBySize = 6;
  state.growthDirection = -1;

  return {
    name: "crossShape",
    state,
    render: () => {
      push();
      fill(state.layerColor);
      noStroke();
      rotate(45);
      rect(0, 0, SHAPE_SIZE / state.divideBySize, SHAPE_SIZE);
      rect(0, 0, SHAPE_SIZE, SHAPE_SIZE / state.divideBySize);
      pop();
    },
    update: () => {
      state.divideBySize += 0.05 * state.growthDirection;
      if (state.divideBySize >= 6) {
        state.growthDirection = -1;
      } else if (state.divideBySize <= 2) {
        state.growthDirection = 1;
      }
    },
  };
};

const multiCircleShape = (state) => {
  state.randomShape = random(1);
  state.rotation = 0;

  return {
    name: "multiCircleShape",
    state,
    render: () => {
      push();
      noStroke();
      fill(state.layerColor);
      rotate(state.rotation);
      if (state.randomShape < 0.33) {
        ellipse(-SHAPE_SIZE / 4, -SHAPE_SIZE / 4, SHAPE_SIZE / 2);
        ellipse(SHAPE_SIZE / 4, SHAPE_SIZE / 4, SHAPE_SIZE / 2);
        ellipse(-SHAPE_SIZE / 4, SHAPE_SIZE / 4, SHAPE_SIZE / 2);
        ellipse(SHAPE_SIZE / 4, -SHAPE_SIZE / 4, SHAPE_SIZE / 2);
      } else if (state.randomShape >= 0.33 && state.randomShape < 0.66) {
        ellipse(-SHAPE_SIZE / 4, -SHAPE_SIZE / 4, SHAPE_SIZE / 2);
        ellipse(SHAPE_SIZE / 4, SHAPE_SIZE / 4, SHAPE_SIZE / 2);
      } else {
        ellipse(-SHAPE_SIZE / 4, SHAPE_SIZE / 4, SHAPE_SIZE / 2);
        ellipse(SHAPE_SIZE / 4, -SHAPE_SIZE / 4, SHAPE_SIZE / 2);
      }
      pop();
    },
    update: () => {
      state.rotation += 2;
    },
  };
};

const ringOfShapes = (state) => {
  state.steps = 7;
  state.center = state.steps * state.singleStep;
  state.randomShape = random(1);
  state.direction = randomSelectTwo();
  state.radius = 30;
  state.currentStep = 0;
  state.growthDirection = 1;

  return {
    name: "Ring of Shapes",
    state,
    render: () => {
      noStroke();
      fill(state.layerColor);
      push();
      for (let i = 0; i < state.currentStep; i++) {
        if (state.randomShape < 0.33) {
          ellipse(0, state.center, state.radius, state.radius);
        } else {
          rect(0, state.center, state.radius, state.radius);
        }
        rotate(state.angle);
      }
      pop();
    },
    update: () => {
      state.currentStep += 0.03 * state.growthDirection;
      if (state.currentStep >= state.steps) {
        state.growthDirection = -1;
      } else if (state.currentStep <= 0) {
        state.growthDirection = 1;
      }
    },
  };
};

const circleShapes = (state) => {
  state.shapeSize = 20;
  state.spacing = 30;
  state.gridSize = 3;
  state.strokeColour = getRandomFromPalette();
  state.rotation = random(360);
  state.rotationSpeed = random(0.5, 2);
  return {
    name: "circleShapes",
    state,
    render: () => {
      push();
      rotate(state.rotation);
      translate(
        -((state.gridSize - 1) * state.spacing) / 2,
        -((state.gridSize - 1) * state.spacing) / 2,
      );
      fill(state.layerColor);
      stroke(state.strokeColour);
      for (let i = 0; i < state.gridSize; i++) {
        for (let j = 0; j < state.gridSize; j++) {
          ellipse(
            j * state.spacing,
            i * state.spacing,
            state.shapeSize + 2 * sin(i + j),
            state.shapeSize + 2 * cos(i - j),
          );
        }
      }
      pop();
    },
    update: () => {
      state.rotation += state.rotationSpeed;
      if (state.rotation > 360) state.rotation -= 360;
    },
  };
};

const parallelogram = (state) => {
  state.shapeSize = SHAPE_SIZE / 2;
  state.w = state.shapeSize * 0.9;
  state.h = state.shapeSize * 0.3;
  state.slant = state.shapeSize * 0.2;
  state.count = 1;
  state.spacing = state.h * 1.5;
  state.numOfShapes = 2;
  state.offsetX = 0;
  state.offsetY = 0;
  state.t = random(1000);
  return {
    name: "parallelogram",
    state,
    render: () => {
      push();
      noStroke();
      fill(state.layerColor);
      translate(-state.slant / 2 + state.offsetX, state.offsetY);
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
          state.h / 2,
        );
        pop();
      }
      pop();
    },
    update: () => {
      if (state.count < state.numOfShapes) {
        state.count += 0.01;
      }
      state.t += 0.07;
      state.offsetX = 4 * sin(state.t * 0.9);
      state.offsetY = 4 * cos(state.t * 1.1);
    },
  };
};

const circleLarge = (state) => {
  state.shapeSize = 120;
  state.weight = 1;
  state.showStroke = randomSelectTwo();
  state.strokeColour = getRandomFromPalette();
  state.t = random(1000);
  state.growth = 1;
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
      circle(0, 0, state.shapeSize * state.growth);
      pop();
    },
    update: () => {
      state.t += 0.06;
      state.growth = 0.9 + 0.15 * sin(state.t);
    },
  };
};

const fourPointedStar = (state) => {
  state.radius = SHAPE_SIZE / 3;
  state.starPoints = 4;
  state.strokeColour = getRandomFromPalette();
  state.t = random(1000);
  state.rotation = 0;
  return {
    name: "fourPointedStar",
    state,
    render: () => {
      push();
      strokeWeight(2);
      stroke(state.strokeColour);
      strokeJoin(ROUND);
      fill(state.layerColor);
      rotate(state.rotation);
      star(0, 0, state.radius / 3, state.radius, state.starPoints);
      pop();
    },
    update: () => {
      state.t += 0.09;
      state.rotation = 0.2 * sin(state.t);
    },
  };
};

const blockShapes = (state) => {
  state.shapeSize = 18;
  state.baseSpacing = 36;
  state.spacing = state.baseSpacing;
  state.gridSizeX = 3;
  state.gridSizeY = 3;
  state.strokeColour = getRandomFromPalette();
  state.t = random(1000);
  return {
    name: "blockShapes",
    state,
    render: () => {
      push();
      translate(
        -((state.gridSizeX - 1) * state.spacing) / 2,
        -((state.gridSizeY - 1) * state.spacing) / 2,
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
            state.shapeSize,
          );
        }
      }
      pop();
    },
    update: () => {
      state.gridSizeX += random(0.005, 0.01);
      state.gridSizeY += random(0.005, 0.01);
    },
  };
};

const multiRoundedRectShape = (state) => {
  state.shapeSize = SHAPE_SIZE;
  state.showStroke = randomSelectTwo();
  state.strokeColour = getRandomFromPalette();
  state.t = random(1000);
  state.rotation = 0;
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
      rotate(state.rotation);
      let w = state.shapeSize / 2;
      let h = state.shapeSize / 2;
      let r = state.shapeSize / 8;
      rect(-state.shapeSize / 4, -state.shapeSize / 4, w, h, r);
      rect(state.shapeSize / 4, state.shapeSize / 4, w, h, r);
      rect(-state.shapeSize / 4, state.shapeSize / 4, w, h, r);
      rect(state.shapeSize / 4, -state.shapeSize / 4, w, h, r);
      pop();
    },
    update: () => {
      state.t += 0.05;
      state.rotation = 0.1 * sin(state.t);
    },
  };
};

// window.mousePressed = function () {
//   console.log("here");

//   saveCanvas("myCanvas", "jpg");
// };
