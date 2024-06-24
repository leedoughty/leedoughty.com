import * as Matter from "matter-js";
import p5 from "p5";
import MatterAttractor from "matter-attractors";

Matter.use(MatterAttractor);

const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;
const Composites = Matter.Composites;

let engine;
let attractor;
let boxes;

function generateColour() {
  const colours = [
    "hsl(7, 80%, 55%)",
    "hsl(37, 98%, 53%)",
    "hsl(51, 100%, 47%)",
    "hsl(97, 71%, 39%)",
    "hsl(230, 74%, 56%)",
    "hsl(330, 56%, 74%)",
    "hsl(210, 29%, 29%)",
    "hsl(300, 100%, 100%)",
  ];
  let randomNumber = Math.floor(Math.random() * colours.length);
  return colours[randomNumber];
}

new p5((p5Instance) => {
  function drawVertices(vertices) {
    p.beginShape();
    for (let i = 0; i < vertices.length; i++) {
      p.vertex(vertices[i].x, vertices[i].y);
    }
    p.endShape(p.CLOSE);
  }

  function drawBody(body) {
    if (body.parts && body.parts.length > 1) {
      for (let p = 1; p < body.parts.length; p++) {
        drawVertices(body.parts[p].vertices);
      }
    } else {
      drawVertices(body.vertices);
    }
  }

  function drawBodies(bodies) {
    for (let i = 0; i < bodies.length; i++) {
      drawBody(bodies[i]);
    }
  }

  const p = p5Instance;

  let attractorX, attractorY;
  let xOff = 0;
  let yOff = 0;

  p.setup = function setup() {
    engine = Engine.create();

    attractorX = window.innerWidth / 2;
    attractorY = window.innerHeight / 2;

    var render = Render.create({
      element: document.body,
      engine: engine,
      width: window.innerWidth,
      height: window.innerHeight,
      wireframes: false,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: "#ebe5d9",
      },
    });

    render.canvas.width = window.innerWidth;
    render.canvas.height = window.innerHeight;

    Render.run(render);

    engine.world.gravity.scale = 0;

    attractor = Bodies.circle(attractorX, attractorY, 50, {
      render: {
        fillStyle: "#54ab1d",
      },
      isStatic: true,
      plugin: {
        attractors: [
          function (bodyA, bodyB) {
            return {
              x: (bodyA.position.x - bodyB.position.x) * 1e-6,
              y: (bodyA.position.y - bodyB.position.y) * 1e-6,
            };
          },
        ],
      },
    });
    World.add(engine.world, attractor);

    boxes = Composites.stack(p.width / 2, 0, 3, 10, 3, 3, function (x, y) {
      let randomNum = p.random(0, 200);
      let randomNum2 = p.random(0, 300);

      return Bodies.rectangle(x, y, randomNum, randomNum2, {
        render: {
          fillStyle: generateColour(),
        },
      });
    });
    World.add(engine.world, boxes);

    const mouse = Mouse.create(p.canvas.elt);
    const mouseParams = {
      mouse: mouse,
      constraint: { stiffness: 0.05 },
    };
    let mouseConstraint = MouseConstraint.create(engine, mouseParams);
    mouseConstraint.mouse.pixelRatio = p.pixelDensity();
    World.add(engine.world, mouseConstraint);

    Engine.run(engine);
  };

  let attractorX2 = window.innerWidth / 2;
  let attractorY2 = window.innerHeight / 2;
  let previousAttractorX = attractorX2;
  let previousAttractorY = attractorY2;

  p.draw = function draw() {
    p.background(233, 227, 213, 255);

    xOff += 0.02;
    yOff += 0.01;

    let nx = p.noise(xOff) * window.innerWidth;
    let ny = p.noise(yOff) * window.innerHeight;

    previousAttractorX = attractorX2;
    previousAttractorY = attractorY2;
    attractorX2 = p.lerp(previousAttractorX, nx, 0.008);
    attractorY2 = p.lerp(previousAttractorY, ny, 0.008);
    Body.setPosition(attractor, { x: attractorX2, y: attractorY2 });

    p.fill(255, 200, 100);
    p.noStroke();
    drawBodies(boxes.bodies);

    p.fill(255, 0, 0);
    p.noStroke();
    drawBody(attractor);

    if (p.mouseIsPressed) {
      console.log("pressed");
      Body.setPosition(attractor, {
        x: p.mouseX - 100,
        y: p.mouseY + 250,
      });
    }
  };

  p.mouseReleased = function mouseReleased() {
    console.log("released");

    attractorX2 = p.mouseX - 100;
    attractorY2 = p.mouseY + 250;
  };
});

async function startCapture(displayMediaOptions) {
  let captureStream = null;

  try {
    captureStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
  } catch (err) {
    console.error(`Error: ${err}`);
  }
  return captureStream;
}
