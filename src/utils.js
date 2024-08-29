import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export function setupOrbitalScene (far = 1000, fov = 75) {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xffffff)
  const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, far)
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  const controls = new OrbitControls(camera, renderer.domElement)
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)

  return { scene, camera, renderer, controls }
}

export function setupScene (far = 1000, fov = 75) {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xffffff)
  const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, far)
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)

  return { scene, renderer, camera }
}

export function onWindowResize (renderer, camera) {
  const width = window.innerWidth
  const height = window.innerHeight
  renderer.setSize(width, height)
  camera.aspect = width / height
  camera.updateProjectionMatrix()
}

export function changeColor (color, newColor, speed = 0.1) {
  for (let i = 0; i < 500; i++) {
    setTimeout(() => {
      color.lerp(new THREE.Color(newColor), speed)
    }, i * 10)
  }
}

export function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function increaseFov (camera, target = 45, speed = 0.1) {
  for (let i = 0.0; i < target; i += 0.1) {
    setTimeout(() => {
      camera.fov += 1
      camera.updateProjectionMatrix()
    }, i * speed)
  }
}

export function captureMouseMovement (mouseInfo, audioAnalyzer) {
  const minX = -512
  const maxX = 512

  window.addEventListener('mousemove', (event) => {
    const mousePercentageX = event.clientX / window.innerWidth
    mouseInfo.targetPositionX = minX + (maxX - minX) * mousePercentageX
  })

  let isAudioPlaying = false

  window.addEventListener('wheel', (event) => {
    const scrollDirection = event.deltaY > 0 ? -1 : 1
    const maxDegreesLookUp = 55
    const minDegreesLookDown = 0
    const scrollSpeedFactor = 0.05

    const maxRotation = maxDegreesLookUp * Math.PI / 180
    const minRotation = minDegreesLookDown * Math.PI / 180

    mouseInfo.targetRotationX = Math.min(Math.max(mouseInfo.targetRotationX - scrollDirection * scrollSpeedFactor, minRotation), maxRotation)

    // If user is looking up, load audio
    if (mouseInfo.targetRotationX === maxRotation && !isAudioPlaying) {
      isAudioPlaying = true
      audioAnalyzer.loadAudio()
    }
  })
}

const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

export function setMouseRayCaster (bentoBoard, camera, scene) {
  /// /////////////////////////
  // Raycaster
  /// /////////////////////////
  window.removeEventListener('click', () => { })
  window.addEventListener('click', (event) => {
    // Normalize mouse position and set to mouse vector
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera)

    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(scene.children)

    // If the box is among the intersected objects, open a link
    for (let i = 0; i < intersects.length; i++) {
      // If click a box of the bento grid
      const boxes = bentoBoard.getBoxes()
      for (let j = 0; j < boxes.length; j++) {
        if (intersects[i].object === boxes[j]) {
          if (boxes[j].userData.url === '') {
            return
          }
          window.open(boxes[j].userData.url, '_blank')
          return
        }
      }
    }
  }, false)
}
