import { shapes } from "./shapes";

const svg1 = document.querySelector("#svg");
const svg2 = document.querySelector("#svg2");
const svg3 = document.querySelector("#svg3");
const container = document.querySelector("#container");

function generateColour() {
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
  let randomNumber = Math.floor(Math.random() * colours.length);
  return colours[randomNumber];
}

function generateShape(svg) {
  svg.querySelectorAll(".shape").forEach((shape) => {
    shape.remove();
  });

  const randomShape1 = shapes[Math.floor(Math.random() * shapes.length)];
  const randomShape2 = shapes[Math.floor(Math.random() * shapes.length)];
  const randomShape3 = shapes[Math.floor(Math.random() * shapes.length)];

  const randomNumber = Math.floor(Math.random() * 10) + 1;

  if (randomNumber % 2 === 0) {
    svg.innerHTML += randomShape1 + randomShape2;
  } else {
    svg.innerHTML += randomShape1 + randomShape2 + randomShape3;
  }

  svg.querySelectorAll(".shape").forEach((shape) => {
    shape.style.fill = generateColour();
    shape.style.mixBlendMode = "multiply";
    svg.setAttribute("width", "450px");
    svg.setAttribute("height", "450px");
    shape.style.transform = "scale(0.75)";

    if (window.innerWidth < 1400) {
      svg.setAttribute("width", "300px");
      svg.setAttribute("height", "300px");
      shape.style.transform = "scale(0.5)";
    }

    if (window.innerWidth < 1000) {
      svg.setAttribute("width", "200px");
      svg.setAttribute("height", "200px");
      shape.style.transform = "scale(0.3)";
    }
  });
}

generateShape(svg1);
generateShape(svg2);
generateShape(svg3);

function updateShape(svg) {
  const shapesInSvg = svg.querySelectorAll(".shape");

  if (shapesInSvg.length > 0) {
    const randomShapeIndex = Math.floor(Math.random() * shapesInSvg.length);

    shapesInSvg[randomShapeIndex].remove();
  }

  const newShape = shapes[Math.floor(Math.random() * shapes.length)];
  svg.innerHTML += newShape;

  const newShapeElement = svg.querySelectorAll(".shape");
  const newlyAddedShape = newShapeElement[newShapeElement.length - 1];

  newlyAddedShape.style.fill = generateColour();
  newlyAddedShape.style.mixBlendMode = "multiply";
  svg.setAttribute("width", "450px");
  svg.setAttribute("height", "450px");
  newlyAddedShape.style.transform = "scale(0.75)";

  if (window.innerWidth < 1400) {
    svg.setAttribute("width", "300px");
    svg.setAttribute("height", "300px");
    newlyAddedShape.style.transform = "scale(0.5)";
  }

  if (window.innerWidth < 1000) {
    svg.setAttribute("width", "200px");
    svg.setAttribute("height", "200px");
    newlyAddedShape.style.transform = "scale(0.3)";
  }
}

setInterval(() => {
  updateShape(svg1);
  updateShape(svg2);
  updateShape(svg3);
}, 250);

setInterval(() => {
  generateShape(svg1);
  generateShape(svg2);
  generateShape(svg3);
}, 5000);

function debounce(func) {
  var timer;
  return function (event) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(func, 250, event);
  };
}

window.addEventListener(
  "resize",
  debounce(function (e) {
    generateShape(svg1);
    generateShape(svg2);
    generateShape(svg3);
  })
);
