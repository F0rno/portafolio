/* eslint-disable no-undef */
import PerlinNoiseSphere from './src/PerlinNoiseSphere.js'
import BentoGrid from './src/BentoGrid.js'
import { boxes } from './src/options.js'
import * as utils from './src/utils.js'
import Grid from './src/Grid.js'
import * as THREE from 'three'
import FontTextMeshLoader from './src/Font.js'
import * as audio from './src/audio.js'

/// /////////////////////////
// Deploy tutorial
// https://medium.com/@aishwaryaparab1/deploying-vite-deploying-vite-app-to-github-pages-166fff40ffd3
// Remove the origin repo
// npm run deploy
/// /////////////////////////

/// /////////////////////////
// Scene
/// /////////////////////////
const { scene, renderer, camera } = utils.setupScene(3000, 85)

const screenWidth = window.innerWidth
const fontData = JSON.parse(document.getElementById('fontData').textContent)

const noiseSphere = new PerlinNoiseSphere()
const bentoBoard = new BentoGrid()
const textMeshLoader = new FontTextMeshLoader('Pablo Fornell', fontData)
let grid

// Sphere setup
const sphereMusicMultiplier = 175
let normalizedSphereSize = parseInt(12 * screenWidth / 512)
normalizedSphereSize = Math.max(normalizedSphereSize, 24)
let normalizedSpherePointsSize = parseInt(screenWidth / 675)
normalizedSpherePointsSize = Math.max(normalizedSpherePointsSize, 1.25)

noiseSphere.switchToStandardMaterial(normalizedSpherePointsSize)
noiseSphere.increaseSize(normalizedSphereSize)
noiseSphere.setPosition(0, 200, 0)

scene.add(noiseSphere.mesh)

// Camera setup
camera.position.set(0, 200, 700)

function displayGrid () {
  grid = new Grid(75, 20, 5500, 2500)
  scene.add(grid.getGrid())
  grid.setRotation(Math.PI / 2, 0, 0)
  grid.setPosition(0, 0, -350)
}

function initialAnimationScript () {
  requestAnimationFrame(animate)
  noiseSphere.animate()
  renderer.render(scene, camera)
}

function mainAnimationLoop () {
  requestAnimationFrame(animate)

  camera.rotation.x += (mouseInfo.targetRotationX - camera.rotation.x) * 0.05
  camera.position.x += (mouseInfo.targetPositionX - camera.position.x) * speedFactorXtranslation

  grid.animateGridPerlinNoise()
  noiseSphere.animate()

  // Sphere move with music!!!
  const { title, data } = audio.getFrequencyData()
  if (data && title === 'Stellar-Odyssey') {
    let scale = THREE.MathUtils.mapLinear(data[0], 0, 255, 0.5, 2)
    scale *= sphereMusicMultiplier
    noiseSphere.getMesh().scale.set(scale, scale, scale)
  }

  renderer.render(scene, camera)
}

let animate = initialAnimationScript
animate()

/// /////////////////////////
// Director
/// /////////////////////////

function initialScriptAnimation () {
  noiseSphere.animateSphereSizeIncreaseWithDelay()
}

const cooldown = 1000
const mouseInfo = {
  targetRotationX: camera.rotation.x,
  targetPositionX: camera.position.x
}
const speedFactorXtranslation = 0.01

async function introAnimationScript () {
  // Sphere expansion
  noiseSphere.animateSphereSizeIncreaseWithDelay(8)
  await utils.sleep(750)
  // Scene transition to black
  utils.changeColor(scene.background, new THREE.Color(0x000000), 0.05)
  await utils.sleep(750)
  camera.position.set(0, 128, 0)
  // Disable camera
  camera.fov = 0
  camera.position.z = 1000
  camera.updateProjectionMatrix()
  // Bentobox grid
  bentoBoard.createBentoGrid(boxes)
  bentoBoard.getBoxes().forEach(box => scene.add(box))
  // Grid
  displayGrid()
  animate = mainAnimationLoop
  // Sphere
  noiseSphere.switchToShaderMaterial()
  noiseSphere.setPosition(0, 1750, -100)
  noiseSphere.animateSphereSizeDecrease(64)
  noiseSphere.setPointsSpeed(0.00006617265106389076)
  noiseSphere.setRotationSpeed(0.001)
  // Text
  textMeshLoader.loadFont()
  const textMesh = textMeshLoader.getTextMesh()
  scene.add(textMesh)
  // Enable camera with effect
  utils.increaseFov(camera, 4.5, 128)
  utils.captureMouseMovement(mouseInfo, audio.playSphereAudio)
  await utils.sleep(500)
}

let clickCounter = 0
let lastClickTimer = 0

window.addEventListener('click', async () => {
  const currentTime = new Date().getTime()
  if (currentTime - lastClickTimer < cooldown) {
    return
  }
  lastClickTimer = currentTime
  clickCounter++
  if (clickCounter < 2) {
    audio.playMainAudio()
    initialScriptAnimation()
  } else if (clickCounter === 2) {
    introAnimationScript()
    utils.setMouseRayCaster(bentoBoard, camera, scene)
  }
})

// Resize handler
window.addEventListener('resize', () => utils.onWindowResize(renderer, camera), false)
