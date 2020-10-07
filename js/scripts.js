import {testFunc} from './test.js';

testFunc();

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

let lightFG = document.getElementsByClassName("lightFG")[0];
let lightBG = document.getElementsByClassName("lightBG")[0];
let lightButton = document.getElementsByClassName("lightButton")[0];
let zoomOutSVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zM7 9h5v1H7z"/></svg>';
let zoomInSVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zm2.5-4h-2v2H9v-2H7V9h2V7h1v2h2v1z"/></svg>';

function addFocus() {
  lightFG.className += " focused";
  lightBG.className += " blurred";
  lightButton.innerHTML = zoomOutSVG;
}

function removeFocus() {
  lightFG.className = "lightFG noInteraction";
  lightBG.className = "lightBG noInteraction";
  lightButton.innerHTML = zoomInSVG;
}

function focusBlur() {
  document.getElementsByClassName("focused").length > 0
    ? removeFocus()
    : addFocus();
}

//onclick was not working with safari, ontouchstart did
//detecting whether navChapter was clicked w ontouchstart to trigger navClose did not work, overrode basic anchor jumpto function. Closed menu but did not move to section. added navclose to the smoothscroll function instead
//note that it worked fine on desktop, can look for onclick event and trigger anchor jump without problem

let modalClick = function (event) {
  if (event.target == navModal) {
    event.preventDefault();
    navClose();
  }
};

if ("ontouchstart" in window) {
  window.ontouchstart = modalClick;
} else {
  window.onclick = modalClick;
}

let goToSection = function (domObj) {
  let sectionName = domObj.getAttribute("name");
  let sectionElement = document.getElementById(sectionName);
  sectionElement.scrollIntoView();
  navClose();
};

//function to add transform-scale CSS to title once the user has scrolled down X amount

let title = document.getElementsByClassName("title")[0];

let upscaler = function (event) {
  if (window.pageYOffset > 120) {
    title.className = "title upscale";
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

//A-B image comparison slider code

let uniqueSliders = document.getElementsByClassName("sliderTop");

let generateSlider = function (sliderTopObj) {
  drawSlider(sliderTopObj);
  let slider = sliderTopObj.parentNode.children[2];

  slider.addEventListener("mousedown", sliderPress);
  slider.addEventListener("touchstart", sliderPress);

  let cursorRelativeToSlider;

  function sliderPress(event) {
    event.preventDefault();
    //if slider is grabbed off center, find out how far from the slider left edge the cursor was
    startingSliderPos = parseInt(slider.style.left.match(/[^px]/g).join(""));
    startingCursorPos = getCursorPos(event);
    cursorRelativeToSlider = startingCursorPos - startingSliderPos;

    window.addEventListener("mousemove", sliderDrag);
    window.addEventListener("touchmove", sliderDrag);
  }

  window.addEventListener("mouseup", sliderRelease);
  window.addEventListener("touchend", sliderRelease);

  function sliderRelease() {
    window.removeEventListener("mousemove", sliderDrag);
    window.removeEventListener("touchmove", sliderDrag);
  }

  function sliderDrag(event) {
    moveSlide(getCursorPos(event));
  }

  function getCursorPos(event) {
    let sliderDistFromLeft = sliderTopObj.getBoundingClientRect().left;
    let cursorDistFromLeft;
    if (event.touches) {
      cursorDistFromLeft = event.touches[0].pageX;
    } else {
      cursorDistFromLeft = event.pageX;
    }

    let relativeCursorX = cursorDistFromLeft - sliderDistFromLeft;
    let anyHorizontalScrolling = window.pageXOffset;
    let correctedCursorX = relativeCursorX - anyHorizontalScrolling;
    return correctedCursorX;
  }

  function moveSlide(pos) {
    let width = sliderTopObj.firstElementChild.offsetWidth;
    //pos parameter is pos of CURSOR on the image, subtractor cursorRelativeSlider to find out where left edge of SLIDER should be
    let adjustedPos = pos - cursorRelativeToSlider;
    let sliderCenter = adjustedPos + slider.offsetWidth / 2;
    //keep the slider inside the image frame
    if (sliderCenter < 0) {
      sliderCenter = 0;
    } else if (sliderCenter > width) {
      sliderCenter = width;
    }
    sliderTopObj.style.width = `${sliderCenter}px`;
    slider.style.left = `${sliderCenter - slider.offsetWidth / 2}px`;
  }
};

function drawSlider(sliderTopObj) {
  let width = sliderTopObj.firstElementChild.offsetWidth;
  let height = sliderTopObj.firstElementChild.offsetHeight;
  sliderTopObj.parentNode.style.width = width;
  sliderTopObj.parentNode.style.height = height;

  sliderTopObj.style.width = `${width / 2}px`;
  let slider = sliderTopObj.parentNode.children[2];
  slider.style.left = `${width / 2 - slider.offsetWidth / 2}px`;
  slider.style.top = `${height / 2 - slider.offsetHeight / 2}px`;
  //above is dynamically generating the wrapper and the slider based on image height after CSS is applied
  //height + width based on the child image height, because if redrawing an already existing slider due to orientation change, the sliderTop will be half its original width
}

//make sure gallery image is fully loaded so height/width parameters aren't 0

[].forEach.call(uniqueSliders, (slider) => {
  if (slider.firstElementChild.complete) {
    generateSlider(slider);
  } else {
    slider.firstElementChild.addEventListener("load", (event) => {
      generateSlider(slider);
    });
  }
});

let uniqueGalleries = document.getElementsByClassName("imgGallery");

function generateGalleryUI(galleryObj) {
  let makeArrow = function (arrowName) {
    let arrow = document.createElement("DIV");
    arrow.setAttribute("class", `${arrowName}`);
    arrow.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
    <path d="M15 8.25H5.87l4.19-4.19L9 3 3 9l6 6 1.06-1.06-4.19-4.19H15v-1.5z" /></svg>`;
    galleryObj.appendChild(arrow);
  };

  ["prevArrow", "nextArrow"].forEach((name) => makeArrow(name));
  drawGallery(galleryObj);

  let prevArrow = galleryObj.children[1];
  let nextArrow = galleryObj.children[2];

  function findFrameWidth() {
    let galleryFrame = galleryObj.firstElementChild.firstElementChild;
    let framePlusMargin =
      galleryFrame.offsetWidth +
      parseInt(getComputedStyle(galleryFrame).marginRight);
    return framePlusMargin;
  }

  function prevClick() {
    let oneFrame = findFrameWidth();
    galleryObj.scrollBy(-oneFrame, 0);
  }
  function nextClick() {
    let oneFrame = findFrameWidth();
    galleryObj.scrollBy(oneFrame, 0);
  }

  galleryObj.addEventListener("scroll", () => arrowVisible(galleryObj));
  prevArrow.addEventListener("click", prevClick);
  nextArrow.addEventListener("click", nextClick);
}

function arrowVisible(galleryObj) {
  let prevArrow = galleryObj.children[1];
  let nextArrow = galleryObj.children[2];
  let margin = document.body.getBoundingClientRect().width * 0.1;
  let leftEdge =
    Math.round(document.body.getBoundingClientRect().left) - margin;
  let rightEdge =
    Math.round(document.body.getBoundingClientRect().right) + margin;
  let galleryWrapper = galleryObj.firstElementChild;
  let galleryLeft = Math.round(galleryWrapper.getBoundingClientRect().left);
  let galleryRight = Math.round(galleryWrapper.getBoundingClientRect().right);
  if (leftEdge <= galleryLeft) {
    prevArrow.style.opacity = "0";
    prevArrow.style.cursor = "default";
  } else {
    prevArrow.style.opacity = ".7";
    prevArrow.style.cursor = "pointer";
  }
  if (rightEdge >= galleryRight) {
    nextArrow.style.opacity = "0";
    nextArrow.style.cursor = "default";
  } else {
    nextArrow.style.opacity = ".7";
    nextArrow.style.cursor = "pointer";
  }
}

function drawGallery(galleryObj) {
  let prevArrow = galleryObj.children[1];
  let nextArrow = galleryObj.children[2];
  [prevArrow, nextArrow].forEach((arrow) => {
    arrow.style.top = `${
      galleryObj.offsetHeight / 2 - arrow.offsetHeight / 2
    }px`;
  });
}

//make sure not a touch screen, and that an image is fully loaded so offsetWidth parameter isn't 0px

if (!("ontouchstart" in window)) {
  [].forEach.call(uniqueGalleries, (gall) => {
    if (gall.firstElementChild.firstElementChild.complete) {
      generateGalleryUI(gall);
    } else {
      gall.firstElementChild.firstElementChild.addEventListener(
        "load",
        (event) => {
          generateGalleryUI(gall);
        }
      );
    }
  });
}

//redraw sliders/galleries if orientation changes

window.addEventListener("resize", function () {
  [].forEach.call(uniqueSliders, (slider) => {
    drawSlider(slider);
  });

  if (!("ontouchstart" in window)) {
    [].forEach.call(uniqueGalleries, (gall) => {
      drawGallery(gall);
      //check if resize has changed what part of gallery is in viewport and arrow needs to be turned on/off
      arrowVisible(gall);
    });
  }
});
