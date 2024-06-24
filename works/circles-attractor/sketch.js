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
  const colours = ["hsl(111, 98%, 34%)", "rgb(253, 253, 253)"];
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

  p.setup = function setup() {
    engine = Engine.create();

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
        background: "hsl(36, 50%, 63%)",
      },
    });

    render.canvas.width = window.innerWidth;
    render.canvas.height = window.innerHeight;

    Render.run(render);

    engine.world.gravity.scale = 0;

    attractor = Bodies.circle(window.innerWidth / 2, window.innerHeight / 2, 50, {
      render: {
        fillStyle: generateColour(),
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

    boxes = Composites.stack(p.width / 2, 0, 3, 20, 3, 3, function (x, y) {
      let randomNum = p.random(20, 220);

      return Bodies.circle(x, y, randomNum, {
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

  p.draw = function draw() {
    p.background(233, 227, 213, 255);

    if (p.mouseIsPressed) {
      Body.translate(attractor, {
        x: (p.mouseX - attractor.position.x) * 0.25 - 25,
        y: (p.mouseY - attractor.position.y) * 0.25 + 75,
      });
    }

    p.stroke(128);
    p.noStroke();
    drawBodies(boxes.bodies);
    drawBody(attractor);
  };
});
