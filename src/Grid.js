import * as THREE from 'three'
import { Noise } from 'noisejs'

class Grid {
  constructor (x, y, squareSizeX = 5, squareSizeY = 5) {
    this.noise = new Noise(Math.random())
    this.gridSize = x + y
    this.squareSizeX = squareSizeX
    this.squareSizeY = squareSizeY
    this.xSize = x
    this.ySize = y
    this.size = this.xSize * this.ySize
    this.geometry = new THREE.BufferGeometry()
    this.positions = []
    this.time = 0
    this.speed = 0.002

    this.initPositions()
    this.initIndexPairs()
    this.lines = new THREE.LineSegments(this.geometry, new THREE.LineBasicMaterial())
  }

  setRotation (x, y, z) {
    this.lines.rotation.x = x
    this.lines.rotation.y = y
    this.lines.rotation.z = z
  }

  getGrid () {
    return this.lines
  }

  mapTo2D (i) {
    const y = Math.floor(i / this.xSize)
    const x = i % this.xSize
    return { x, y }
  }

  mapFrom2D (x, y) {
    return x + y * this.xSize
  }

  initPositions () {
    for (let i = 0; i < this.size; i++) {
      const p = this.mapTo2D(i)
      const noiseX = this.noise.perlin2(p.x / 100, p.y / 100)
      const noiseY = this.noise.perlin2(p.y / 100, p.x / 100)
      this.positions.push((p.x - this.xSize / 2 + noiseX) * this.squareSizeX / this.xSize)
      this.positions.push((p.y - this.ySize / 2 + noiseY) * this.squareSizeY / this.ySize)
      this.positions.push(0)
    }

    const positionAttribute = new THREE.Float32BufferAttribute(this.positions, 3)
    this.geometry.setAttribute('position', positionAttribute)
  }

  initIndexPairs () {
    const indexPairs = []
    for (let i = 0; i < this.size; i++) {
      const p = this.mapTo2D(i)
      if (p.x + 1 < this.xSize) {
        indexPairs.push(i)
        indexPairs.push(this.mapFrom2D(p.x + 1, p.y))
      }
      if (p.y + 1 < this.ySize) {
        indexPairs.push(i)
        indexPairs.push(this.mapFrom2D(p.x, p.y + 1))
      }
    }
    this.geometry.setIndex(indexPairs)
  }

  animateGridPerlinNoise () {
    this.directionFlag = this.directionFlag || 1

    if (this.time > 100) {
      this.directionFlag = -1 // change direction backwards
    } else if (this.time < 0) {
      this.directionFlag = 1 // change direction forwards
    }

    this.time += this.speed * this.directionFlag // increment or decrement time by speed

    for (let i = 0; i < this.size; i++) {
      const p = this.mapTo2D(i)
      const noiseX = this.noise.perlin2(p.x / 10 + this.time, p.y / 10 + this.time)
      const noiseY = this.noise.perlin2(p.y / 10 + this.time, p.x / 10 + this.time)
      this.positions[3 * i] = (p.x - this.xSize / 2 + noiseX) * this.squareSizeX / this.xSize
      this.positions[3 * i + 1] = (p.y - this.ySize / 2 + noiseY) * this.squareSizeY / this.ySize
    }
    const positionAttribute = this.geometry.getAttribute('position')
    positionAttribute.array = new Float32Array(this.positions)
    positionAttribute.needsUpdate = true
  }

  setPosition (x, y, z) {
    this.lines.position.set(x, y, z)
  }
}

export default Grid
