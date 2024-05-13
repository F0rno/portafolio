import * as utils from './src/utils.js';
import Grid from './src/Grid.js';
import PerlinNoiseSphere from './src/PerlinNoiseSphere.js';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import BentoGrid from './src/BentoGrid.js';
import { AudioAnalyzer } from './src/AudioAnalizer.js';

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

const sphereMusicMultiplier = 175;
let normalizedSphereSize = parseInt(12 * screenWidth / 512);
normalizedSphereSize = Math.max(normalizedSphereSize, 24);
let normalizedSpherePointsSize = parseInt(screenWidth / 675);
normalizedSpherePointsSize = Math.max(normalizedSpherePointsSize, 1.25);

camera.position.set(0, 200, 700);

noiseSphere.switchToStandardMaterial(normalizedSpherePointsSize);
noiseSphere.increaseSize(normalizedSphereSize);

noiseSphere.setPosition(0, 200, 0);
scene.add(noiseSphere.mesh);

function animateSphereSizeIncreaseWithDelay(speed = 10) {
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
    grid = new Grid(100, 8000);
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
    
    // Sphere move with music!!!
    const data = audioAnalyzer.getFrequencyData();
    if (data) {
        let scale = THREE.MathUtils.mapLinear(data[0], 0, 255, 0.5, 2);
        scale *= sphereMusicMultiplier;
        noiseSphere.getMesh().scale.set(scale, scale, scale);
    }
    
    renderer.render(scene, camera);
}

let animate = initialAnimation;
animate();

// Resize handler
window.addEventListener('resize', () => utils.onWindowResize(renderer, camera), false);

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

const bentoUp = 0;
const bentoLeft = 125;
const bentoDepth = 0;

// Bento grid boxes
const boxes = [
    // Upper row
    [
        // 1 alone
        { 
            videoSrc: 'github.mp4', 
            size: { x: 100, y: 100, z: 100+bentoDepth }, 
            position: { x: -450+bentoLeft, y: 150+bentoUp, z: 0 }, 
            url: 'https://github.com/F0rno' 
        },
        // Big 4
        { 
            videoSrc: 'stay-tuned.mp4', 
            size: { x: 200, y: 200, z: 100+bentoDepth }, 
            position: { x: -300+bentoLeft, y: 200+bentoUp, z: 0 }, 
            url: '' 
        },
        // 4 alone
        //  top
        { 
            videoSrc: 'stay-tuned.mp4', 
            size: { x: 100, y: 100, z: 100+bentoDepth }, 
            position: { x: -150+bentoLeft, y: 250+bentoUp, z: 0 }, 
            url: '' 
        },
        { 
            videoSrc: 'stay-tuned.mp4', 
            size: { x: 100, y: 100, z: 100+bentoDepth }, 
            position: { x: -50+bentoLeft, y: 250+bentoUp, z: 0 }, 
            url: '' 
        },
        //  bottom
        { 
            videoSrc: 'stay-tuned.mp4', 
            size: { x: 100, y: 100, z: 100+bentoDepth }, 
            position: { x: -150+bentoLeft, y: 150+bentoUp, z: 0 }, 
            url: ''
        },
        { 
            videoSrc: 'stay-tuned.mp4', 
            size: { x: 100, y: 100, z: 100+bentoDepth }, 
            position: { x: -50+bentoLeft, y: 150+bentoUp, z: 0 }, 
            url: ''
        },
        // 1 alone
        { 
            videoSrc: 'linkedin.mp4', 
            size: { x: 100, y: 100, z: 100+bentoDepth }, 
            position: { x: 150+bentoLeft, y: 150+bentoUp, z: 0 }, 
            url: 'https://www.linkedin.com/in/pablo-fornell/' 
        },
    ],
    // Lower row
    [
        // Big 2 horizontal
        { 
            videoSrc: 'stay-tuned.mp4', 
            size: { x: 200, y: 100, z: 100+bentoDepth }, 
            position: { x: -500+bentoLeft, y: 50+bentoUp, z: 0 }, 
            url: '' 
        },
        // 2 alone
        { 
            videoSrc: 'stay-tuned.mp4', 
            size: { x: 100, y: 100, z: 100+bentoDepth }, 
            position: { x: -350+bentoLeft, y: 50+bentoUp, z: 0 }, 
            url: '' 
        },
        { 
            videoSrc: 'x.mp4', 
            size: { x: 100, y: 100, z: 100+bentoDepth }, 
            position: { x: -250+bentoLeft, y: 50+bentoUp, z: 0 }, 
            url: 'https://twitter.com/F_de_Fornell' 
        },
        // Big 2 horizontal
        { 
            videoSrc: 'stay-tuned.mp4', 
            size: { x: 200, y: 100, z: 100+bentoDepth }, 
            position: { x: -100+bentoLeft, y: 50+bentoUp, z: 0 }, 
            url: '' 
        },
        // Big 3 vertical
        {
            videoSrc: 'stay-tuned.mp4',
            size: { x: 100, y: 300, z: 100+bentoDepth },
            position: { x: 50+bentoLeft, y: 150+bentoUp, z: 0 },
            url: ''
        },
        // 2 alone
        { 
            videoSrc: 'stay-tuned.mp4', 
            size: { x: 100, y: 100, z: 100+bentoDepth }, 
            position: { x: 150+bentoLeft, y: 50+bentoUp, z: 0 }, 
            url: '' 
        },
        { 
            videoSrc: 'stay-tuned.mp4', 
            size: { x: 100, y: 100, z: 100+bentoDepth }, 
            position: { x: 250+bentoLeft, y: 50+bentoUp, z: 0 }, 
            url: '' 
        },
    ],
];
bentoBoard.createBentoGrid(boxes);


////////////////////////////
// Director
////////////////////////////

let clickCount = 0;
let lastClickTime = 0;
const debounceTime = 1000;
let targetRotation = camera.rotation.x;
let targetPositionX = camera.position.x;
const speedFactorXtranslation = 0.01;
// Create a raycaster and a mouse vector
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

function initialScript() {
    animateSphereSizeIncreaseWithDelay()
}

async function mainScript() {
    // Sphere expansion
    animateSphereSizeIncreaseWithDelay(8)
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
    animate = mainAnimation;
    // Sphere
    noiseSphere.switchToShaderMaterial();
    noiseSphere.setPosition(0, 1750, -100);
    animateSphereSizeDecrease(64);
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
        mainScript()
        setMouseRayCaster()
    }
});
/*
initialScript()
mainScript()
setMouseRayCaster()
*/