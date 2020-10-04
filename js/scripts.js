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

let lightFG = document.getElementsByClassName('lightFG')[0];
let lightBG = document.getElementsByClassName('lightBG')[0];
let lightButton = document.getElementsByClassName('lightButton')[0];
let lightModal = document.getElementsByClassName('lightModal')[0];

function focusBlur() {
  lightFG.className += " focused";
  lightBG.className += " blurred";
  lightButton.className += " blurred";
  lightModal.className += " darkenFrame";
  document.body.style['overflow-y'] = "hidden";
}

//onclick was not working with safari, ontouchstart did

if ("ontouchstart" in window) {
  window.ontouchstart = function (event) {
    if (event.target == navModal) {
      navClose();
    } else if ((event.target == lightFG)||(event.target == lightModal)) {
      lightFG.className = "lightFG";
      lightBG.className = "lightBG";
      lightButton.className = "lightButton";
      lightModal.className = "lightModal";
      document.body.style['overflow-y'] = "visible";
    }
  };
} else {
  window.onclick = function (event) {
    if (event.target == navModal) {
      navClose();
    } else if ((event.target == lightFG)||(event.target == lightModal)) {
      lightFG.className = "lightFG";
      lightBG.className = "lightBG";
      lightButton.className = "lightButton";
      lightModal.className = "lightModal";
      document.body.style['overflow-y'] = "visible";
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

//function to animate sectionTitles and sectionImgs

let headersObj = document.getElementsByClassName("sectionHeader");
let allHeaders = Object.keys(headersObj).map((header) => headersObj[header]);

let colorizer = function (entries) {
  let mostlyVisible = entries[0].intersectionRatio >= 0.8;
  let childElements = entries[0].target.children;
  if (mostlyVisible) {
    childElements[0].className += " fadeIn";
    childElements[1].className += " colorized";
  } else {
    childElements[0].className = "sectionTitle";
    childElements[1].className = "sectionImg";
  }
};

let headerObserver = new IntersectionObserver(colorizer, {
  threshold: 0.8,
});

allHeaders.forEach((header) => headerObserver.observe(header));

//get all quotes on page, iterate and pass each one to observer and trigger animation when one is 100% on page
//use `active` tags that add the transition timing instead of having it on the base class, so element transitions in, but not out (instant change) when the `active` tag is removed

let quotesObj = document.getElementsByClassName("blockQuote");
let allQuotes = Object.keys(quotesObj).map((quote) => quotesObj[quote]);

let expander = function (entries) {
  let fullyVisible = entries[0].intersectionRatio >= 1;
  let childElements = entries[0].target.children;
  if (fullyVisible) {
    childElements[0].children[0].className["baseVal"] +=
      " activeMark slideLeft";
    childElements[0].children[1].className["baseVal"] +=
      " activeMark slideRight";
    childElements[1].className += " activeText expanded";
    childElements[2].className += " activeText expanded";
  }
};

let quoteObserver = new IntersectionObserver(expander, { threshold: 1 });

allQuotes.forEach((quote) => quoteObserver.observe(quote));

//check if quote completely out of view. is bottom of page (scrollY + window.innerHeight) above top of quote? (element.offsetTop) If so reset.
let vanisher = function (entries) {
  let childElements = entries[0].target.children;
  let outOfView = entries[0].intersectionRatio == 0;
  let topOfElement = entries[0].target.offsetTop;
  let bottomOfPage = window.pageYOffset + window.innerHeight;
  if (outOfView && bottomOfPage < topOfElement) {
    childElements[0].children[0].className["baseVal"] = "leftQuote";
    childElements[0].children[1].className["baseVal"] = "rightQuote";
    childElements[1].className = "quote";
    childElements[2].className = "citation";
  }
};

let quoteVanisher = new IntersectionObserver(vanisher, { threshold: 0 });

allQuotes.forEach((quote) => quoteVanisher.observe(quote));
