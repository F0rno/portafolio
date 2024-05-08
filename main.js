import * as utils from './src/utils.js';
import Grid from './src/grid.js';
import PerlinNoiseSphere from './src/PerlinNoiseSphere.js';
import { sphere } from './src/options.js';
import * as THREE from 'three';

let { scene, renderer, camera } = utils.setupScene(4000, 85)
let grid;

// Camera orbit
let elapsedTime = 0;
const radius = 2000;

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

function animateDecreaseSphereSize(decrease=100) {
    // decrease the size of the sphere with no delay
    for (let i = 0; i < decrease; i++) {
        perlinSphere.increaseSize(0.99);
    }
}

function showFloor() {
    grid = new Grid(100, 5000);
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
    
    elapsedTime += 0.001; // Orbit speed

    // Rotate the sphere and the grid
    perlinSphere.mesh.rotation.y += 0.001; // Adjust the value as needed
    grid.lines.rotation.z += 0.001

    // Make the camera look at the object
    camera.lookAt(perlinSphere.getPosition());

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

function startMouseCaption() {
    // Define your min and max x values
    const minY = 100;
    const maxY = 575;

    const minX = -600;
    const maxX = 600;

    // Define a lerp factor
    const lerpFactor = 0.5;

    // Add an event listener for the mousemove event
    window.addEventListener('mousemove', (event) => {
        // Get the mouse position as a percentage of the window height
        const mousePercentageY = event.clientY / window.innerHeight;
        const mousePercentageX = event.clientX / window.innerWidth;

        // Map the mouse percentage to a y value between minY and maxY
        const targetY = minY + (maxY - minY) * mousePercentageY;
        const targetX = minX + (maxX - minX) * mousePercentageX;

        // Lerp the camera position
        camera.position.y += (targetY - camera.position.y) * lerpFactor;
        camera.position.x += (targetX - camera.position.x) * lerpFactor;
    });
}

window.addEventListener('click', async () => {
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
        await utils.sleep(750)
        // Change background color to white
        utils.changeColor(scene.background, new THREE.Color(0x000000), 0.05);
        await utils.sleep(750)
        // Camera
        camera.position.z = 2000;
        camera.position.y = 450;
        camera.fov = 0;
        camera.updateProjectionMatrix();
        // Change animation to include grid
        showFloor();
        animate = animateWithGrid;
        perlinSphere.switchToShaderMaterial();
        perlinSphere.setPosition(0, 675, 0);
        animateDecreaseSphereSize(75);
        perlinSphere.setPointsSpeed(0.0001);
        perlinSphere.setRotationSpeed(0.001);
        utils.increaseFov(camera, 4.5, 128);
        startMouseCaption();
    }
});