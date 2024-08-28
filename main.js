import * as utils from './src/utils.js';
import Grid from './src/Grid.js';
import PerlinNoiseSphere from './src/PerlinNoiseSphere.js';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import BentoGrid from './src/BentoGrid.js';
import { AudioAnalyzer } from './src/AudioAnalizer.js';
import { boxes } from './src/options.js';

////////////////////////////
// Deploy tutorial
// https://medium.com/@aishwaryaparab1/deploying-vite-deploying-vite-app-to-github-pages-166fff40ffd3
// Remove the origin repo
// npm run deploy
////////////////////////////

////////////////////////////
// Scene
////////////////////////////
let { scene, renderer, camera } = utils.setupScene(3000, 85)

const screenWidth = window.innerWidth;

const noiseSphere = new PerlinNoiseSphere();
const audioAnalyzer = new AudioAnalyzer('Stellar-Odyssey.mp3');
const bentoBoard = new BentoGrid();
let grid;


// Sphere setup
const sphereMusicMultiplier = 175;
let normalizedSphereSize = parseInt(12 * screenWidth / 512);
normalizedSphereSize = Math.max(normalizedSphereSize, 24);
let normalizedSpherePointsSize = parseInt(screenWidth / 675);
normalizedSpherePointsSize = Math.max(normalizedSpherePointsSize, 1.25);

noiseSphere.switchToStandardMaterial(normalizedSpherePointsSize);
noiseSphere.increaseSize(normalizedSphereSize);
noiseSphere.setPosition(0, 200, 0);

scene.add(noiseSphere.mesh);

// Camera setup
camera.position.set(0, 200, 700);

function displayGrid() {
    grid = new Grid(100, 8000);
    scene.add(grid.getGrid());
    grid.setRotation(Math.PI / 2, 0, 0);
}

function initialAnimationScript() {
    requestAnimationFrame(animate);
    noiseSphere.animate();
    renderer.render(scene, camera);
}

function mainAnimationLoop() {
    requestAnimationFrame(animate);
    
    camera.rotation.x += (targetRotation - camera.rotation.x) * 0.05;
    camera.position.x += (targetPositionX - camera.position.x) * speedFactorXtranslation;
    
    grid.animateGridPerlinNoise();
    noiseSphere.animate();
    
    // Sphere move with music!!!
    const data = audioAnalyzer.getFrequencyData();
    if (data) {
        let scale = THREE.MathUtils.mapLinear(data[0], 0, 255, 0.5, 2);
        scale *= sphereMusicMultiplier;
        noiseSphere.getMesh().scale.set(scale, scale, scale);
    }
    
    renderer.render(scene, camera);
}

let animate = initialAnimationScript;
animate();

// Pablo Fornell text
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
    textMesh.position.set(-width / 2, (-height / 2)+425, (0));
    
    // Dark lines effect
    const edges = new THREE.EdgesGeometry(textGeometry);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
    const outline = new THREE.LineSegments(edges, lineMaterial);
    
    textMesh.add(outline);
};

let fontData = JSON.parse(document.getElementById('fontData').textContent);
loadFont(fontLoader.parse(fontData))


// Bento board
bentoBoard.createBentoGrid(boxes);


////////////////////////////
// Director
////////////////////////////

function initialScript() {
    noiseSphere.animateSphereSizeIncreaseWithDelay()
}

let clickCount = 0;
let lastClickTime = 0;
const debounceTime = 1000;
let targetRotation = camera.rotation.x;
let targetPositionX = camera.position.x;
const speedFactorXtranslation = 0.01;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function captureMouseMovement() {
    const minX = -512;
    const maxX = 512;

    window.addEventListener('mousemove', (event) => {
        const mousePercentageX = event.clientX / window.innerWidth;
        targetPositionX = minX + (maxX - minX) * mousePercentageX;
    });

    let isAudioPlaying = false;

    window.addEventListener('wheel', (event) => {
        const scrollDirection = event.deltaY > 0 ? -1 : 1;
        const maxDegreesLookUp = 55;
        const minDegreesLookDown = 0;
        const scrollSpeedFactor = 0.05;

        const maxRotation = maxDegreesLookUp * Math.PI / 180;
        const minRotation = minDegreesLookDown * Math.PI / 180;

        targetRotation = Math.min(Math.max(targetRotation - scrollDirection * scrollSpeedFactor, minRotation), maxRotation);

        // If user is looking up, load audio
        if (targetRotation === maxRotation && !isAudioPlaying) {
            isAudioPlaying = true;
            audioAnalyzer.loadAudio();
        }
    });
}

async function introAnimationScript() {
    // Sphere expansion
    noiseSphere.animateSphereSizeIncreaseWithDelay(8)
    await utils.sleep(750)
    // Scene transition to black
    utils.changeColor(scene.background, new THREE.Color(0x000000), 0.05);
    await utils.sleep(750)
    camera.position.set(0, 128, 0);
    // Disable camera
    camera.fov = 0;
    camera.position.z = 1000;
    camera.updateProjectionMatrix();
    // Bentobox grid
    bentoBoard.getBoxes().forEach(box => scene.add(box));
    // Grid
    displayGrid();
    animate = mainAnimationLoop;
    // Sphere
    noiseSphere.switchToShaderMaterial();
    noiseSphere.setPosition(0, 1750, -100);
    noiseSphere.animateSphereSizeDecrease(64);
    noiseSphere.setPointsSpeed(0.0001);
    noiseSphere.setRotationSpeed(0.001);
    // Text
    scene.add(textMesh);
    // Enable camera with effect
    utils.increaseFov(camera, 4.5, 128);
    captureMouseMovement();
    await utils.sleep(500)
}

function setMouseRayCaster() {
    ////////////////////////////
    // Raycaster
    ////////////////////////////
    window.removeEventListener('click', () => { });
    window.addEventListener('click', (event) => {
        // Normalize mouse position and set to mouse vector
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Update the picking ray with the camera and mouse position
        raycaster.setFromCamera(mouse, camera);

        // Calculate objects intersecting the picking ray
        const intersects = raycaster.intersectObjects(scene.children);

        // If the box is among the intersected objects, open a link
        for (let i = 0; i < intersects.length; i++) {
            // If click a box of the bento grid
            const boxes = bentoBoard.getBoxes();
            for (let j = 0; j < boxes.length; j++) {
                if (intersects[i].object === boxes[j]) {
                    if (boxes[j].userData.url === '') {
                        return;
                    }
                    window.open(boxes[j].userData.url, '_blank');
                    return;
                }
            }
        }
    }, false);
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
        introAnimationScript()
        setMouseRayCaster()
    }
});

// Resize handler
window.addEventListener('resize', () => utils.onWindowResize(renderer, camera), false);

/*
initialScript()
mainScript()
setMouseRayCaster()
*/