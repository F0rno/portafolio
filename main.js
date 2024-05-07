import * as utils from './src/utils.js';
import Grid from './src/grid.js';
import PerlinNoiseSphere from './src/PerlinNoiseSphere.js';
import { sphere } from './src/options.js';
import * as THREE from 'three';

let { scene, renderer, camera } = utils.setupOrbitalScene(2000, 85)
let grid;

camera.position.z = 700;
camera.position.y = 200;
camera.position.x = 0;

let perlinSphere = new PerlinNoiseSphere();
perlinSphere.switchToStandardMaterial();

let increaseFactor = 41;

perlinSphere.increaseSize(increaseFactor);
perlinSphere.setPosition(0, 200, 0);
scene.add(perlinSphere.mesh);

function animateIncreaseSphereSize(speed = 10) {
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            perlinSphere.increaseSize(1.01);
        }, i * speed);
    }
}

function animateDecreaseSphereSize() {
    // decrease the size of the sphere with no delay
    for (let i = 0; i < 100; i++) {
        perlinSphere.decreaseSize(0.99);
    }
}

function showFloor() {
    grid = new Grid(200, 4000);
    scene.add(grid.getGrid());
    // Set the grid to "floor" rotation
    grid.setRotation(Math.PI / 2, 0, 0);
}

function animateWithoutGrid() {
    requestAnimationFrame(animate);
    perlinSphere.animate();
    renderer.render(scene, camera);
}

function animateWithGrid() {
    requestAnimationFrame(animate);
    grid.animateGridPerlinNoise();
    perlinSphere.animate();
    renderer.render(scene, camera);
}

let animate = animateWithoutGrid;
animate();

// Resize handler
window.addEventListener('resize', () => utils.onWindowResize(renderer, camera), false);


////////////////////////////////////////
// Director
////////////////////////////////////////

let clickCount = 0;
let lastClickTime = 0;
const debounceTime = 1000; // 1000 milliseconds = 1 second

window.addEventListener('click', () => {
    // Avoid click span
    let currentTime = new Date().getTime();
    if (currentTime - lastClickTime < debounceTime) {
        return; // Too soon since last click, ignore this one
    }
    lastClickTime = currentTime;

    clickCount++;
    if (clickCount < 2) {
        animateIncreaseSphereSize()
    } else if (clickCount === 2) {
        animateIncreaseSphereSize(8)
        // Change background color to white
        utils.changeColor(scene.background, new THREE.Color(0x000000), 0.08);
        // Change animation to include grid
        showFloor();
        animate = animateWithGrid;
        perlinSphere.switchToShaderMaterial();
        // Move the camera to a better position
        camera.position.z = 2000;
        animateDecreaseSphereSize();
    }
});