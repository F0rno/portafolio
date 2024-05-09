import * as utils from './src/utils.js';
import Grid from './src/grid.js';
import PerlinNoiseSphere from './src/PerlinNoiseSphere.js';
import { sphere } from './src/options.js';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';


// TODO: Try to animate the far not the fov
// TODO: Sphere properties randomizer
// TODO: Html content

let { scene, renderer, camera } = utils.setupScene(4000, 85)
let grid;

// Camera orbit
let elapsedTime = 0;

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
    grid = new Grid(100, 10000);
    scene.add(grid.getGrid());
    // Set the grid to "floor" rotation
    grid.setRotation(Math.PI / 2, 0, 0);
}

function loadAnimation() {
    requestAnimationFrame(animate);
    perlinSphere.animate();
    renderer.render(scene, camera);
}

function mainAnimation() {
    requestAnimationFrame(animate);
    
    elapsedTime += 0.001; // Orbit speed

    // Rotate the sphere and the grid
    //perlinSphere.mesh.rotation.y += 0.001; // Adjust the value as needed
    //grid.lines.rotation.z += 0.001

    // Make the camera look at the object
    //camera.lookAt(perlinSphere.getPosition());

    camera.rotation.x += (targetRotation - camera.rotation.x) * 0.05;

    camera.position.x += (targetPositionX - camera.position.x) * speedFactorXtranslation;

    grid.animateGridPerlinNoise();
    perlinSphere.animate();

    renderer.render(scene, camera);
}

let animate = loadAnimation;
animate();

// Resize handler
window.addEventListener('resize', () => utils.onWindowResize(renderer, camera), false);

// Load the font
const fontLoader = new FontLoader();
let textMesh;

fontLoader.load('./public/Swera.json', function(font) {
    // Create a geometry of your name
    const textGeometry = new TextGeometry('Pablo Fornell', {
        font: font,
        size: 75,
        depth: 25,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.01,
        bevelOffset: 0,
        bevelSegments: 5
    });

    // Compute the bounding box of the text geometry
    textGeometry.computeBoundingBox();

    // Get the dimensions of the bounding box
    const width = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
    const height = textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y;
    const depth = textGeometry.boundingBox.max.z - textGeometry.boundingBox.min.z;

    // Create a material for the text
    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

    // Create a mesh with the geometry and material
    textMesh = new THREE.Mesh(textGeometry, textMaterial);

    // Set the position of the text to center it
    textMesh.position.set(-width / 2, (-height / 2)+400, (-1000));
});


////////////////////////////////////////
// Director
////////////////////////////////////////

let clickCount = 0;
let lastClickTime = 0;
const debounceTime = 1000; // 1000 milliseconds = 1 second
let targetRotation = camera.rotation.x;
let targetPositionX = camera.position.x;
const speedFactorXtranslation = 0.01;

function startMouseCaption() {
    const minX = -600;
    const maxX = 600;

    // Define a lerp factor

    // Add an event listener for the mousemove event
    window.addEventListener('mousemove', (event) => {
        // Get the mouse position as a percentage of the window width
        const mousePercentageX = event.clientX / window.innerWidth;

        // Map the mouse percentage to a x value between minX and maxX
        targetPositionX = minX + (maxX - minX) * mousePercentageX;
    });

    // Add an event listener for the wheel event
    window.addEventListener('wheel', (event) => {
        const scrollDirection = event.deltaY > 0 ? -1 : 1;
        const maxDegreesLookUp = 90;
        const minDegreesLookDown = -45;
        const scrollSpeedFactor = 0.05;

        const maxRotation = maxDegreesLookUp * Math.PI / 180;
        const minRotation = minDegreesLookDown * Math.PI / 180;

        targetRotation = Math.min(Math.max(targetRotation - scrollDirection * scrollSpeedFactor, minRotation), maxRotation);
    });
}

function loadScript() {
    animateIncreaseSphereSize()
}

async function mainScript() {
    animateIncreaseSphereSize(8)
    await utils.sleep(750)
    // Change background color to white
    utils.changeColor(scene.background, new THREE.Color(0x000000), 0.05);
    await utils.sleep(750)
    // Camera
    camera.position.x = 0;
    camera.position.z = 0;
    camera.position.y = 128; // 450
    camera.fov = 0;
    //camera.far = 0;
    camera.updateProjectionMatrix();
    // Change animation to include grid
    showFloor();
    animate = mainAnimation;
    perlinSphere.switchToShaderMaterial();
    perlinSphere.setPosition(0, 900, 0);
    animateDecreaseSphereSize(75);
    perlinSphere.setPointsSpeed(0.0001);
    perlinSphere.setRotationSpeed(0.001);
    scene.add(textMesh);
    utils.increaseFov(camera, 4.5, 128);
    startMouseCaption();
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
        loadScript()
    } else if (clickCount === 2) {
        mainScript()
    }
});