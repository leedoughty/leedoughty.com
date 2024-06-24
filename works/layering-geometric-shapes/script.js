import { shapes } from "./shapes";

const svg = document.querySelector("#svg");

function generateColour() {
  const colours = [
    "#e8441f",
    "#fa920d",
    "#f4cd00",
    "#54ab1d",
    "#3d58e3",
    "#e195bb",
    "#aa4d7e",
    "#b1881e",
  ];
  let randomNumber = Math.floor(Math.random() * colours.length);
  return colours[randomNumber];
}

setInterval(() => {
  svg.innerHTML = "";

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

    if (window.innerWidth < 600) {
      svg.setAttribute("width", "300px");
      svg.setAttribute("height", "300px");
      shape.style.transform = "scale(0.5)";
    }
  });
}, 1000);
