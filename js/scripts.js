if (true) {
  console.log("hellow rold");
}

var navModal = document.getElementsByClassName("navModal")[0];
var navBar = document.getElementById("navBar");

function navOpen() {
  navModal.style.display = 'block';
  navBar.style.left = '0';
}

function navClose() {
  navModal.style.display = 'none';
  navBar.style.left = '-30vw';
}

window.onclick = function(event) {
  console.log(event.target);
  if (event.target == navModal) {
    navClose();
  }
}