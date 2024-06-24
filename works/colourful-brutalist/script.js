const greens = document.querySelectorAll(".green");
const pinks = document.querySelectorAll(".pink");
const blues = document.querySelectorAll(".blue");

blues.forEach((element) => {
  element.style.fill = "#E8E9EB";
});

pinks.forEach((element) => {
  element.style.fill = "#CCCDC6";
});

greens.forEach((element) => {
  element.style.fill = "#ACADA8";
});

function map(num, in_min, in_max, out_min, out_max) {
  return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
}

function generateRgbValue(r, g, b) {
  return `rgb(${Math.floor(r)},${Math.floor(g)},${Math.floor(b)}`;
}

function changeColours(
  event,
  colour1,
  colour2,
  colour3,
  colour4,
  colour5,
  colour6,
  elementToChange
) {
  const r = map(event.screenX ?? event.touches[0].clientX, 0, window.innerWidth, colour1, colour2);
  const g = map(event.screenX ?? event.touches[0].clientX, 0, window.innerWidth, colour3, colour4);
  const b = map(event.screenX ?? event.touches[0].clientX, 0, window.innerWidth, colour5, colour6);
  const colour = generateRgbValue(r, g, b);
  elementToChange.forEach((element) => {
    element.style.fill = colour;
  });
}

const colourVal = Array.from({ length: 18 }, () => {
  return Math.floor(Math.random() * 255);
});

function onMouseMove(event) {
  changeColours(
    event,
    colourVal[0],
    colourVal[1],
    colourVal[2],
    colourVal[3],
    colourVal[4],
    colourVal[5],
    greens
  );
  changeColours(
    event,
    colourVal[6],
    colourVal[7],
    colourVal[8],
    colourVal[9],
    colourVal[10],
    colourVal[11],
    pinks
  );
  changeColours(
    event,
    colourVal[12],
    colourVal[13],
    colourVal[14],
    colourVal[15],
    colourVal[16],
    colourVal[17],
    blues
  );
}

window.addEventListener("mousemove", onMouseMove);
window.addEventListener("touchmove", onMouseMove);
