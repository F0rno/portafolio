import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function setupOrbitalScene(far=1000, fov=75) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, far);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true});
    const controls = new OrbitControls(camera, renderer.domElement);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    return { scene, camera, renderer, controls };
}

export function setupScene(far=1000, fov=75) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, far);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    return { scene, renderer, camera };
}

export function onWindowResize(renderer, camera) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}

// Make a function to recive a hex color by reference and change it gradually
export function changeColor(color, newColor, speed=0.1) {
    for (let i = 0; i < 500; i++) {
        setTimeout(() => {
            color.lerp(new THREE.Color(newColor), speed);
        }, i * 10);
    }
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function increaseFov(camera, target=45, speed=0.1) {
    for (let i = 0.0; i < target; i += 0.1) {
        setTimeout(() => {
            camera.fov += 1;
            camera.updateProjectionMatrix();
        }, i * speed);
    }
}

