import * as THREE from 'three';
import { Noise } from 'noisejs';

class Grid {
    constructor(gridSize = 10, squareSize = 5) {
        this.noise = new Noise(Math.random());
        this.gridSize = gridSize;
        this.squareSize = squareSize;
        this.xSize = gridSize;
        this.ySize = gridSize;
        this.size = this.xSize * this.ySize;
        this.geometry = new THREE.BufferGeometry();
        this.positions = [];
        this.time = 0;
        this.speed = 0.003;

        this.initPositions();
        this.initIndexPairs();
        this.lines = new THREE.LineSegments(this.geometry, new THREE.LineBasicMaterial());
    }

    setRotation(x, y, z) {
        this.lines.rotation.x = x;
        this.lines.rotation.y = y;
        this.lines.rotation.z = z;
    }

    getGrid() {
        return this.lines;
    }

    mapTo2D(i) {
        let y = Math.floor(i / this.xSize);
        let x = i % this.xSize;
        return { x: x, y: y };
    }

    mapFrom2D(x, y) {
        return x + y * this.xSize;
    }

    initPositions() {
        for (let i = 0; i < this.size; i++) {
            let p = this.mapTo2D(i);
            let noiseX = this.noise.perlin2(p.x / 100, p.y / 100);
            let noiseY = this.noise.perlin2(p.y / 100, p.x / 100);
            this.positions.push((p.x - this.xSize / 2 + noiseX) * this.squareSize / this.xSize);
            this.positions.push((p.y - this.ySize / 2 + noiseY) * this.squareSize / this.ySize);
            this.positions.push(0);
        }

        let positionAttribute = new THREE.Float32BufferAttribute(this.positions, 3);
        this.geometry.setAttribute("position", positionAttribute);
    }

    initIndexPairs() {
        let indexPairs = [];
        for (let i = 0; i < this.size; i++) {
            let p = this.mapTo2D(i);
            if (p.x + 1 < this.xSize) {
                indexPairs.push(i);
                indexPairs.push(this.mapFrom2D(p.x + 1, p.y));
            }
            if (p.y + 1 < this.ySize) {
                indexPairs.push(i);
                indexPairs.push(this.mapFrom2D(p.x, p.y + 1));
            }
        }
        this.geometry.setIndex(indexPairs);
    }

    animateGridPerlinNoise() {
        // FIX: The time should go backwards instead of stop and reset
        if (this.time > 10) {
            this.time = 0;
        } else { 
            this.time += this.speed;
        }
        for (let i = 0; i < this.size; i++) {
            let p = this.mapTo2D(i);
            let noiseX = this.noise.perlin2(p.x / 10 + this.time, p.y / 10 + this.time);
            let noiseY = this.noise.perlin2(p.y / 10 + this.time, p.x / 10 + this.time);
            this.positions[3 * i] = (p.x - this.xSize / 2 + noiseX) * this.squareSize / this.xSize;
            this.positions[3 * i + 1] = (p.y - this.ySize / 2 + noiseY) * this.squareSize / this.ySize;
        }
        let positionAttribute = this.geometry.getAttribute("position");
        positionAttribute.array = new Float32Array(this.positions);
        positionAttribute.needsUpdate = true;
    }
}

export default Grid;