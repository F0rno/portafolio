import * as THREE from 'three';

class BentoGrid {
    constructor() {
        this.boxes = [];
    }

    createBox(videoSrc, size, position, url) {
        // Create a video element
        const video = document.createElement('video');
        video.src = videoSrc;
        video.muted = true;
        video.load();
        video.play();
        video.loop = true;

        // Create a video texture
        const videoTexture = new THREE.VideoTexture(video);

        // Create a box with the video texture on one face and basic material on other faces
        const boxGeometry = new THREE.BoxGeometry(size.x, size.y, size.z);
        const materials = [
            new THREE.MeshPhongMaterial(), // Front face
            new THREE.MeshPhongMaterial(), // Back face
            new THREE.MeshPhongMaterial(), // Top face
            new THREE.MeshPhongMaterial(), // Bottom face
            new THREE.MeshBasicMaterial({ map: videoTexture }), // Right face
            new THREE.MeshPhongMaterial()  // Left face
        ];
        const box = new THREE.Mesh(boxGeometry, materials);
        box.position.set(position.x, position.y, position.z);
        box.userData = { url }; // Store the URL in the box's userData
    
        return box;
    }

    createBentoGrid(grid) {
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                const box = this.createBox(grid[i][j].videoSrc, grid[i][j].size, grid[i][j].position, grid[i][j].url);
                this.boxes.push(box);
            }
        }
    }

    getBoxes() {
        return this.boxes;
    }

    getBoxURL(box) {
        return box.userData.url;
    }
}

export default BentoGrid;