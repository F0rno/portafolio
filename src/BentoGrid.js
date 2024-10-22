import * as THREE from 'three'

class BentoGrid {
  constructor () {
    this.boxes = []
    this.videoTextureCache = {} // Cache for video textures
  }

  createBox (videoSrc, size, position, url) {
    let videoTexture

    // Check if the video texture is already cached
    if (this.videoTextureCache[videoSrc]) {
      videoTexture = this.videoTextureCache[videoSrc]
    } else {
      // Video element
      const video = document.createElement('video')
      video.src = videoSrc
      video.muted = true
      video.load()
      video.play()
      video.loop = true

      videoTexture = new THREE.VideoTexture(video)

      // Store the texture in the cache
      this.videoTextureCache[videoSrc] = videoTexture
    }

    // Create a box with the video texture on one face and basic material on other faces
    const boxGeometry = new THREE.BoxGeometry(size.x, size.y, size.z)
    const materials = [
      new THREE.MeshBasicMaterial(), // Front face
      new THREE.MeshBasicMaterial(), // Back face
      new THREE.MeshBasicMaterial(), // Top face
      new THREE.MeshBasicMaterial(), // Bottom face
      new THREE.MeshBasicMaterial({ map: videoTexture }), // Right face
      new THREE.MeshBasicMaterial() // Left face
    ]
    const box = new THREE.Mesh(boxGeometry, materials)
    box.position.set(position.x, position.y, position.z)
    box.userData = { url } // Store the URL in the box's userData

    // Dark lines effect
    const edges = new THREE.EdgesGeometry(boxGeometry)
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 })
    const outline = new THREE.LineSegments(edges, lineMaterial)
    box.add(outline)

    return box
  }

  createBentoGrid (boxes) {
    for (let i = 0; i < boxes.length; i++) {
      for (let j = 0; j < boxes[i].length; j++) {
        const box = this.createBox(boxes[i][j].videoSrc, boxes[i][j].size, boxes[i][j].position, boxes[i][j].url)
        this.boxes.push(box)
      }
    }
  }

  getBoxes () {
    return this.boxes
  }

  getBoxURL (box) {
    return box.userData.url
  }
}

export default BentoGrid
