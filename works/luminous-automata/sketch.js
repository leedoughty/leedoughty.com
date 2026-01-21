const SHAPE_SIZE = 70;
const SIDES = 6;

const PADDING = 0;
const GRIDBOX = 30;
const BACKGROUND_COLOUR = "#06004f";
let PALETTE = [];

let ALL_SHAPES = [];
let CELL_STATE = [];
let NEXT_CELL_STATE = [];
let COLUMNS, ROWS;
let offsetX, offsetY;
let prevTime = 0;

function calculateGrid(BORDER_WIDTH) {
  const availableWidth = width - BORDER_WIDTH * 2;
  const availableHeight = height - BORDER_WIDTH * 2;

  COLUMNS = 60;
  ROWS = 60;

  offsetX = (width - COLUMNS * GRIDBOX) / 2;
  offsetY = (height - ROWS * GRIDBOX) / 2;
}

function initializeShapes() {
  ALL_SHAPES = [];
  CELL_STATE = [];
  NEXT_CELL_STATE = [];
  for (let x = 0; x < COLUMNS; x++) {
    CELL_STATE[x] = [];
    NEXT_CELL_STATE[x] = [];
    for (let y = 0; y < ROWS; y++) {
      ALL_SHAPES.push({
        x,
        y,
        shape: null,
        active: false,
      });
      CELL_STATE[x][y] = random() > 0.7 ? 1 : 0;
      NEXT_CELL_STATE[x][y] = 0;
    }
  }
}

window.setup = () => {
  createCanvas(windowWidth, windowHeight);
  calculateGrid(50);
  PALETTE = [
    "#01b2e8",
    "#e8441f",
    "#ff6a00",
    "#f7a000",
    "#f4cd00",
    "#54ab1d",
    "#1b82e6",
    "#6d5acf",
  ];
  blendMode(SCREEN);
  angleMode(DEGREES);
  rectMode(CENTER);
  prevTime = millis();
  initializeShapes();
};

function countActiveNeighbors(x, y) {
  let count = 0;
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      let nx = x + dx;
      let ny = y + dy;
      if (nx >= 0 && nx < COLUMNS && ny >= 0 && ny < ROWS) {
        count += CELL_STATE[nx][ny];
      }
    }
  }
  return count;
}

let automataFrameCounter = 0;
const AUTOMATA_UPDATE_INTERVAL = 10;

window.draw = () => {
  const currentTime = millis();
  const deltaTime = currentTime - prevTime;
  prevTime = currentTime;

  clear();
  background(BACKGROUND_COLOUR);

  automataFrameCounter++;
  if (automataFrameCounter >= AUTOMATA_UPDATE_INTERVAL) {
    for (let x = 0; x < COLUMNS; x++) {
      for (let y = 0; y < ROWS; y++) {
        const neighbors = countActiveNeighbors(x, y);
        if (CELL_STATE[x][y] === 1) {
          NEXT_CELL_STATE[x][y] = neighbors === 2 || neighbors === 3 ? 1 : 0;
        } else {
          NEXT_CELL_STATE[x][y] = neighbors === 3 ? 1 : 0;
        }
      }
    }
    let temp = CELL_STATE;
    CELL_STATE = NEXT_CELL_STATE;
    NEXT_CELL_STATE = temp;
    automataFrameCounter = 0;
  }

  for (let cell of ALL_SHAPES) {
    const { x, y } = cell;
    if (CELL_STATE[x][y] === 1) {
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
    name: "circleShape",
    init: (props) =>
      circleShape({
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

const makeShape = (pos, targetY) => {
  shuffle(layerConstructors);

  let layers = layerConstructors.map((layerConstructor) => {
    return layerConstructor.init({
      pos,
      draw: true,
    });
  });

  const numShapesToDraw = random(3);

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
  ((state.numShapes = state.sides),
    (state.angle = 360 / state.numShapes),
    (state.singleStep = SHAPE_SIZE / 2 / state.stepsOut),
    (state.layerColor = getRandomFromPalette()));
  state.strokeColour = getRandomFromPalette();
  return state;
};

const circleShape = (state) => {
  state.radius = SHAPE_SIZE;
  state.starPoints = 4;

  return {
    name: "circleShape",
    state,
    render: () => {
      push();
      strokeWeight(2);
      stroke(state.strokeColour);
      strokeJoin(ROUND);
      fill(state.layerColor);
      circle(0, 0, state.radius);
      pop();
    },
  };
};
