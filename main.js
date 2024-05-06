import * as utils from './src/utils.js';
import Grid from './src/grid.js';
import PerlinNoiseSphere from './src/PerlinNoiseSphere.js';

let { scene, renderer, camera } = utils.setupScene(2000)

// Add Grid to floor
let grid = new Grid(200, 3000);
scene.add(grid.getGrid());
// Set the grid to "floor" rotation
grid.setRotation(Math.PI / 2, 0, 0);

// Add PerlinNoiseSphere
let perlinSphere = new PerlinNoiseSphere();
scene.add(perlinSphere.mesh);
perlinSphere.setPosition(0, 200, 0);
perlinSphere.increaseSize(32);
perlinSphere.switchToStandardMaterial();

// Set camera position
camera.position.z = 400;
camera.position.y = 200;

function animate() {
    requestAnimationFrame(animate);
    grid.animateGridPerlinNoise();
    perlinSphere.animate();
    //controls.update();
    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => utils.onWindowResize(renderer, camera), false);

setTimeout(() => {
    const canvas = document.querySelector('#defaultCanvas0');
    canvas.parentNode.removeChild(canvas);
}, 2000);

/*
window.onload = function() {
    if (window.sketch) {
        console.log("p5.min.js has been loaded.");
    } else {
        console.log("p5.min.js has not been loaded.");
    }
};
*/