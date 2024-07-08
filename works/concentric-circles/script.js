const grid = document.querySelector("#grid");
const amountOfBoxes = 15;

function generateRandomColour() {
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
    "#f5f5f5",
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

function generateNumberFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function makeCircles() {
  let randomNumberOfCircles = generateNumberFromInterval(2, 5);
  let radius = 80;
  let circles = "";

  for (let i = 0; i < randomNumberOfCircles; i++) {
    circles += `<circle cx="100" cy="100" r="${radius}" stroke="none" fill="${generateRandomColour()}" />`;

    let randomNumberToMinusFromRadius = generateNumberFromInterval(3, 30);
    let newCircleRadius = radius - randomNumberToMinusFromRadius;

    if (newCircleRadius > 10) {
      radius = newCircleRadius;
    } else {
      radius = 0;
    }
  }

  circles += `<circle cx="100" cy="100" r="20" stroke="none" fill="#d8d1c8" />`;
  return circles;
}

function createSvg() {
  return `<svg class="item">${makeCircles()}</svg>`;
}

for (let i = 0; i < amountOfBoxes; i++) {
  grid.innerHTML += createSvg();
}

function replaceRandomSvg() {
  const items = document.querySelectorAll(".item");

  if (items.length > 0) {
    const randomIndex = Math.floor(Math.random() * items.length);
    const randomItem = items[randomIndex];

    randomItem.outerHTML = createSvg();
  }
}

setInterval(replaceRandomSvg, 1000);
