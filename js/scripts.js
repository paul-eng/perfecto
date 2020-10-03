// Navbar functions

let navModal = document.getElementsByClassName("navModal")[0];
let navBar = document.getElementById("navBar");

function navOpen() {
  navModal.style.display = "block";
  navBar.style.left = "0";
}

function navClose() {
  navModal.style.display = "none";
  navBar.style.left = "-70vw";
}

window.onclick = function (event) {
  if (event.target == navModal) {
    navClose();
  }
};

//function to add transform-scale CSS to title once the user has scrolled down X amount

let title = document.getElementsByClassName("title")[0];

let upscaler = function (event) {
  if (window.pageYOffset > 125) {
    title.className += " upscale";
  } else {
    title.className = "title";
  }
};

//IntersectionObserverAPI call removes event listener when title is not visible to save resources

let titleVisibility = function (entries) {
  let visible = entries[0].isIntersecting;
  if (visible) {
    window.addEventListener("scroll", upscaler, true);
  } else {
    window.removeEventListener("scroll", upscaler, true);
  }
};

let titleObserver = new IntersectionObserver(titleVisibility);
titleObserver.observe(title);

//function to colorize section header

let bwHeader = document.getElementsByClassName("marlon")[0];

let headerVisibility = function (entries) {
  let amountVisible = entries[0].intersectionRatio;
  if (amountVisible >= 0.5) {
    bwHeader.className += " colorized";
  } else {
    bwHeader.className = "marlon";
  }
};

let headerObserver = new IntersectionObserver(headerVisibility, {
  threshold: 0.5,
});
headerObserver.observe(bwHeader);
