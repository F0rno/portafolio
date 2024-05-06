// Starfield
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/challenges/1-starfield
// https://youtu.be/17WoOqgXsRM

let stars = [];

let speed;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  for (var i = 0; i < 2500; i++) {
    stars[i] = new Star();
  }
}

function draw() {
  speed = map(500, 0, 3000, 0, 50);
  background(0);
  translate(width / 2, height / 2);
  for (let i = 0; i < stars.length; i++) {
    stars[i].update();
    stars[i].show();
  }
}