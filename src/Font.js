import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import * as THREE from 'three';

class FontTextMeshLoader {
    constructor(name, fontData) {
        this.fontLoader = new FontLoader();
        this.textMesh = null;
        this.fontData = fontData;
        this.name = name;
    }

    loadFont() {
        const font = this.fontLoader.parse(this.fontData);
        const textGeometry = new TextGeometry(this.name, {
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

        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        this.textMesh = new THREE.Mesh(textGeometry, textMaterial);
        this.textMesh.position.set(-width / 2, (-height / 2) + 425, 0);

        // Dark lines effect
        const edges = new THREE.EdgesGeometry(textGeometry);
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
        const outline = new THREE.LineSegments(edges, lineMaterial);

        this.textMesh.add(outline);
    }

    getTextMesh() {
        return this.textMesh;
    }
}

export default FontTextMeshLoader;