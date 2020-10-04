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

//onclick was not working with safari, ontouchstart did

if ("ontouchstart" in window) {
  window.ontouchstart = function (event) {
    if (event.target == navModal) {
      navClose();
    }
  };
} else {
  window.onclick = function (event) {
    if (event.target == navModal) {
      navClose();
    }
  };
}

//function to add transform-scale CSS to title once the user has scrolled down X amount

let title = document.getElementsByClassName("title")[0];

let upscaler = function (event) {
  if (window.pageYOffset > 120) {
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

//darken top banner if only a bit visible

let asset = document.getElementsByClassName("bannerAsset")[0];

let bannerDarken = function () {
  if (window.pageYOffset > 1200) {
    asset.className += " darken";
  } else {
    asset.className = "bannerAsset";
  }
};

let bannerVisibility = function (entries) {
  let visible = entries[0].isIntersecting;
  if (visible) {
    window.addEventListener("scroll", bannerDarken, true);
  } else {
    window.removeEventListener("scroll", bannerDarken, true);
  }
};

let bannerObserver = new IntersectionObserver(bannerVisibility);
bannerObserver.observe(asset);

//function to animate section1 header + h3 title

let bwHeader = document.getElementsByClassName("marlon")[0];
let firstTitle = document.getElementsByClassName("section1")[0];

let colorizer = function (entries) {
  let amountVisible = entries[0].intersectionRatio;
  if (amountVisible >= 0.8) {
    bwHeader.className += " colorized";
    firstTitle.className += " fadeIn";
  } else {
    bwHeader.className = "marlon";
    firstTitle.className = "section1";
  }
};

let headerObserver = new IntersectionObserver(colorizer, {
  threshold: 0.8,
});
headerObserver.observe(bwHeader);

//get all quotes on page, pass each one to observer and trigger animation when one is completely on page

let quotesObj = document.getElementsByClassName("blockQuote");
let allQuotes = Object.keys(quotesObj).map((quote) => quotesObj[quote]);

let expander = function (entries) {
  let fullyVisible = entries[0].intersectionRatio >= 1;
  let childElements = entries[0].target.children;
  if (fullyVisible) {
    /* iterating through the children is unnecessary, always same order so you can bracket in

    for (element in childElements) {
      if (typeof childElements[element] == "object") {
        childElements[element].className += " expanded";
      }
    }
    */
    childElements[0].className += " expanded";
    childElements[1].className += " expanded";
  }
};

let quoteObserver = new IntersectionObserver(expander, { threshold: 1 });

allQuotes.forEach((quote) => quoteObserver.observe(quote));
