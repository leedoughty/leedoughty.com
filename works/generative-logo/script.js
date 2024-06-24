import { shapes } from "./shapes";
import { allLetters } from "./letters";

function generateColourPairs() {
  const colours = [
    "#e8441f",
    "#fa920d",
    "#f4cd00",
    "#54ab1d",
    "#3d58e3",
    "#e195bb",
    "#aa4d7e",
    "#34495e",
  ];
  let randomNumber = Math.floor(Math.random() * colours.length);
  return colours[randomNumber];
}

function makeShapes() {
  const amountOfBoxes = 10;
  const container = document.querySelector("#container");

  container.innerHTML = "";

  [...Array(amountOfBoxes)].forEach((x, i) => {
    const randomShape1 = shapes[Math.floor(Math.random() * shapes.length)];
    const randomLetter =
      allLetters[i][Math.floor(Math.random() * allLetters[i].length)];

    container.innerHTML += `
      <div class="item-container">
        <svg class="item" width="300px" height="300px">
          ${randomShape1}
          ${randomLetter}
        </svg>
      </div>
    `;

    const shapeElements = document.querySelectorAll(".shape");
    const letterElements = document.querySelectorAll(".letter");

    shapeElements.forEach((shape) => {
      shape.style.fill = generateColourPairs();
      shape.style.mixBlendMode = "multiply";
      shape.style.transform = "scale(0.3)";
    });

    letterElements.forEach((letter) => {
      letter.style.fill = generateColourPairs();
      letter.style.mixBlendMode = "multiply";
      letter.style.transform = "scale(0.3)";
    });
  });
}

makeShapes();

setInterval(() => {
  makeShapes();
}, 3000);
