const homepageWorks = document.querySelectorAll(".work");
const workContainer = document.querySelector(".work-container");

const workContainerHeight = workContainer.offsetHeight / 2;
const workContainerWidth = workContainer.offsetWidth / 2;

homepageWorks.forEach((work) => {
  const randomTop = Math.floor(Math.random() * workContainerHeight);
  const randomLeft = Math.floor(Math.random() * workContainerWidth);

  work.style.top = `${randomTop}px`;
  work.style.left = `${randomLeft}px`;
});
