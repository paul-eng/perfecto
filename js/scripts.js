// Navbar functions

let navModal = document.getElementsByClassName("navModal")[0];
let navBar = document.getElementById("navBar");

function navOpen() {
  navModal.style.display = 'block';
  navBar.style.left = '0';
}

function navClose() {
  navModal.style.display = 'none';
  navBar.style.left = '-70vw';
}

window.onclick = function(event) {
  if (event.target == navModal) {
    navClose();
  }
}

//ObserverAPI call to see if title is visible

/* 

let titleAnimator = function(entries) {
  console.log(entries[0].isIntersecting)
};

let observer = new IntersectionObserver(titleAnimator);
observer.observe(title); */

let title = document.getElementsByClassName('title')[0];

window.addEventListener('scroll', function(e){
  if (window.pageYOffset > 150) {
    title.className += ' upscale';
  } else {
    title.className = 'title'
  }
})

//need to add a remove event listener when title not visible
