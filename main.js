import * as utils from './src/utils.js';
import Grid from './src/grid.js';
import PerlinNoiseSphere from './src/PerlinNoiseSphere.js';
import { sphere } from './src/options.js';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

// TODO: Sphere properties randomization

const htmlContent = document.querySelector('main');

// Three.js scene setup
let { scene, renderer, camera } = utils.setupScene(4000, 85)

let grid;

camera.position.set(0, 200, 700);

let noiseSphere = new PerlinNoiseSphere();
noiseSphere.switchToStandardMaterial();

noiseSphere.increaseSize(41);
noiseSphere.setPosition(0, 200, 0);
scene.add(noiseSphere.mesh);

function animateSphereSizeIncrease(speed = 10) {
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            noiseSphere.increaseSize(1.01);
        }, i * speed);
    }
}

function animateSphereSizeDecrease(decrease=100) {
    for (let i = 0; i < decrease; i++) {
        noiseSphere.increaseSize(0.99);
    }
}

function displayGrid() {
    grid = new Grid(100, 10000);
    scene.add(grid.getGrid());
    grid.setRotation(Math.PI / 2, 0, 0);
}

function initialAnimation() {
    requestAnimationFrame(animate);
    noiseSphere.animate();
    renderer.render(scene, camera);
}

function mainAnimation() {
    requestAnimationFrame(animate);

    camera.rotation.x += (targetRotation - camera.rotation.x) * 0.05;
    camera.position.x += (targetPositionX - camera.position.x) * speedFactorXtranslation;

    grid.animateGridPerlinNoise();
    noiseSphere.animate();

    renderer.render(scene, camera);
}

let animate = initialAnimation;
animate();

// Resize handler
window.addEventListener('resize', () => utils.onWindowResize(renderer, camera), false);

const fontLoader = new FontLoader();
let textMesh;

function loadFont (font) {
    const textGeometry = new TextGeometry('Pablo  Fornell', {
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

    textGeometry.computeBoundingBox();

    const width = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
    const height = textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y;
    const depth = textGeometry.boundingBox.max.z - textGeometry.boundingBox.min.z;

    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(-width / 2, (-height / 2)+400, (-1000));

    // Dark lines effect
    const edges = new THREE.EdgesGeometry(textGeometry);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
    const outline = new THREE.LineSegments(edges, lineMaterial);

    textMesh.add(outline);
};

let fontData = JSON.parse(document.getElementById('fontData').textContent);
loadFont(fontLoader.parse(fontData))

let clickCount = 0;
let lastClickTime = 0; // TODO: 1000 
const debounceTime = 0;
let targetRotation = camera.rotation.x;
let targetPositionX = camera.position.x;
const speedFactorXtranslation = 0.01;

function displayHtmlContent() {
    htmlContent.style.opacity = "1";
}

function captureMouseMovement() {
    const minX = -512;
    const maxX = 512;

    window.addEventListener('mousemove', (event) => {
        const mousePercentageX = event.clientX / window.innerWidth;
        targetPositionX = minX + (maxX - minX) * mousePercentageX;
    });

    window.addEventListener('wheel', (event) => {
        const scrollDirection = event.deltaY > 0 ? -1 : 1;
        const maxDegreesLookUp = 85;
        const minDegreesLookDown = -45;
        const scrollSpeedFactor = 0.05;

        const maxRotation = maxDegreesLookUp * Math.PI / 180;
        const minRotation = minDegreesLookDown * Math.PI / 180;

        targetRotation = Math.min(Math.max(targetRotation - scrollDirection * scrollSpeedFactor, minRotation), maxRotation);
    });
}

function initialScript() {
    animateSphereSizeIncrease()
}

async function mainScript() {
    // Sphere expansion
    animateSphereSizeIncrease(8)
    await utils.sleep(750)
    // Scene transition to black
    utils.changeColor(scene.background, new THREE.Color(0x000000), 0.05);
    await utils.sleep(750)
    camera.position.set(0, 128, 0);
    // Disable camera
    camera.fov = 0;
    camera.updateProjectionMatrix();
    displayGrid();
    animate = mainAnimation;
    noiseSphere.switchToShaderMaterial();
    noiseSphere.setPosition(0, 2000, -100);
    animateSphereSizeDecrease(64);
    noiseSphere.setPointsSpeed(0.0001);
    noiseSphere.setRotationSpeed(0.001);
    scene.add(textMesh);
    // Enable camera with effect
    utils.increaseFov(camera, 4.5, 128);
    captureMouseMovement();
    await utils.sleep(500)
}

window.addEventListener('click', async () => {
    let currentTime = new Date().getTime();
    if (currentTime - lastClickTime < debounceTime) {
        return;
    }
    lastClickTime = currentTime;
    clickCount++;
    if (clickCount < 2) {
        initialScript()
    } else if (clickCount === 2) {
        mainScript()
    }
});