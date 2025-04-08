/* ---------------------------------------- sketch ---------------------------------------- */
/* ---------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------- */

const SHAPE_SIZE = 50;
const SIDES = 6;

const PADDING = 30;
const GRIDBOX = SHAPE_SIZE + PADDING;
const BACKGROUND_COLOUR = "#1a1d3f";

let PALETTE = [];
let ALL_SHAPES = [];
let COLUMNS, ROWS;
let offsetX, offsetY;
let prevTime = 0;

function calculateGrid() {
  COLUMNS = 20;
  ROWS = 20;

  offsetX = (width - COLUMNS * GRIDBOX) / 2;
  offsetY = (height - ROWS * GRIDBOX) / 2;
}

function initializeShapes() {
  for (let x = 0; x < COLUMNS; x++) {
    for (let y = 0; y < ROWS; y++) {
      ALL_SHAPES.push({
        x,
        y,
        shape: null,
        active: false,
      });
    }
  }
}

window.setup = function () {
  createCanvas(windowWidth, windowHeight);
  calculateGrid(50);
  PALETTE = [
    "#ff5ec4",
    "#14a6ff",
    "#e8441f",
    "#ff6a00",
    "#f7a000",
    "#f4cd00",
    "#15ad03",
    "#1b82e6",
    "#6d5acf",
    "#dddddd",
  ];
  angleMode(DEGREES);
  rectMode(CENTER);
  prevTime = millis();
  initializeShapes();
  frameRate(60);
};

let noiseTime = 0;
const noiseScale = 0.15;

window.draw = function () {
  const currentTime = millis();
  const deltaTime = currentTime - prevTime;
  prevTime = currentTime;

  const smoothFactor = min(deltaTime / 16.67, 3);

  clear();
  background(BACKGROUND_COLOUR);

  noiseTime += 0.006;

  for (let cell of ALL_SHAPES) {
    const { x, y } = cell;
    const noiseValue = noise(x * noiseScale, y * noiseScale, noiseTime);
    const threshold = 0.5;

    if (noiseValue > threshold) {
      if (!cell.active) {
        const posX = offsetX + x * GRIDBOX + GRIDBOX / 2;
        const posY = offsetY + y * GRIDBOX + GRIDBOX / 2;
        const pos = { x: posX, y: posY };
        cell.shape = makeShape(pos, posY);
        cell.active = true;
      }
      drawShape(cell.shape);
    } else {
      cell.active = false;
    }
  }
};

window.windowResized = function () {
  resizeCanvas(windowWidth, windowHeight);
  calculateGrid(50);
  initializeShapes();
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
  {
    name: "blockShapes",
    init: (props) =>
      blockShapes({
        ...props,
        ...setState(state),
      }),
    weight: 0.1,
  },
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
    name: "lineShapes",
    init: (props) =>
      lineShapes({
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

  const numShapesToDraw = 2;

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
  (state.numShapes = state.sides),
    (state.angle = 360 / state.numShapes),
    (state.singleStep = SHAPE_SIZE / 2 / state.stepsOut),
    (state.layerColor = getRandomFromPalette());
  state.strokeColour = getRandomFromPalette();
  return state;
};

const blockShapes = (state) => {
  state.shapeSize = random(10, 20);
  state.spacing = randomSelectTwo() ? 30 : 60;
  state.gridSizeX = 2;
  state.gridSizeY = 2;
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

const circleShapes = (state) => {
  state.shapeSize = randomSelectTwo() ? 10 : 5;
  state.spacing = 20;
  state.gridSize = randomSelectTwo() ? 10 : 5;
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

const lineShapes = (state) => {
  state.shapeSize = random(40, 150);
  state.lines = random(3, 10);
  state.spacing = 20;
  state.rotation = 0;
  state.strokeColour =
    state.strokeColour === state.layerColor
      ? getRandomFromPalette()
      : state.strokeColour;

  return {
    name: "lineShapes",
    state,
    render: () => {
      push();
      noFill();
      stroke(state.strokeColour);
      rotate(state.rotation);
      strokeWeight(2);
      for (let i = 0; i < state.lines; i++) {
        let yOffset = (i - (state.lines - 1) / 2) * state.spacing;
        line(-state.shapeSize / 2, yOffset, state.shapeSize / 2, yOffset);
      }
      pop();
    },
  };
};

const concentricCircles = (state) => {
  state.weight = 1;
  state.shapeSize = SHAPE_SIZE / 1.5 - state.weight;

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
  state.numShapes = 6;
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
  state.shapeSize = randomSelectTwo() ? SHAPE_SIZE : SHAPE_SIZE / 2;
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
  state.shapeSize = SHAPE_SIZE / 1.5;
  state.thickStroke = 5;
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
  state.shapeSize = randomSelectTwo() ? SHAPE_SIZE / 2 : SHAPE_SIZE / 3;
  state.cornerRadius = 10;
  state.weight = state.shapeSize === SHAPE_SIZE / 2 ? 20 : 8;

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
  state.shapeSize = SHAPE_SIZE * 4;
  state.weight = 1;

  return {
    name: "circleLarge",
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

const fourPointedStar = (state) => {
  state.radius = randomSelectTwo() ? SHAPE_SIZE / 3 : SHAPE_SIZE / 5;
  state.starPoints = 4;

  return {
    name: "fourPointedStar",
    state,
    render: () => {
      push();
      strokeWeight(5);
      strokeJoin(ROUND);
      noStroke();
      fill(state.layerColor);
      star(0, 0, state.radius / 3, state.radius, state.starPoints);
      pop();
    },
  };
};
