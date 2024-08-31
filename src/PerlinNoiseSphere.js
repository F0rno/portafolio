/* eslint-disable no-loss-of-precision */
import * as THREE from 'three'
import * as shaders from './webGL_shaders'
import { sphere } from './options'

/// ///////////////////////////////////////////////
// From https://codepen.io/vcomics/pen/djqNrm
// Victor Vergara
/// ///////////////////////////////////////////////

class PerlinNoiseSphere {
  constructor () {
    this.mesh = new THREE.Object3D()
    this.mat = new THREE.ShaderMaterial({
      wireframe: false,
      uniforms: {
        time: { type: 'f', value: 0.0 },
        pointscale: { type: 'f', value: 0.0 },
        decay: { type: 'f', value: 0.0 },
        complex: { type: 'f', value: 0.0 },
        waves: { type: 'f', value: 0.0 },
        eqcolor: { type: 'f', value: 0.0 },
        fragment: { type: 'i', value: true },
        redhell: { type: 'i', value: true }
      },
      vertexShader: shaders.vertexShader,
      fragmentShader: shaders.fragmentShader
    })

    const geo = new THREE.IcosahedronGeometry(3, 100)
    const mesh = new THREE.Points(geo, this.mat)
    this.mesh.add(mesh)

    this.options = {
      perlin: {
        vel: 0.002, // Rotation speed 0.002
        speed: 0.0001488884648937542, // Points speed 0.0001488884648937542
        perlins: 1.5, // Size in the control panel
        decay: 1,
        complex: 0.30,
        waves: 6.0,
        eqcolor: 15.0, // HUE in the control panel
        fragment: false,
        redhell: true
      },
      spin: {
        sinVel: 0.0,
        ampVel: 80.0
      }
    }

    this.start = Date.now()
  }

  animate () {
    const performance = Date.now() * 0.003

    this.mesh.rotation.y += this.options.perlin.vel
    this.mesh.rotation.x = (Math.sin(performance * this.options.spin.sinVel) * this.options.spin.ampVel) * Math.PI / 180

    this.mat.uniforms.time.value = this.options.perlin.speed * (Date.now() - this.start)
    this.mat.uniforms.pointscale.value = this.options.perlin.perlins
    this.mat.uniforms.decay.value = this.options.perlin.decay
    this.mat.uniforms.complex.value = this.options.perlin.complex
    this.mat.uniforms.waves.value = this.options.perlin.waves
    this.mat.uniforms.eqcolor.value = this.options.perlin.eqcolor
    this.mat.uniforms.fragment.value = this.options.perlin.fragment
    this.mat.uniforms.redhell.value = this.options.perlin.redhell
  }

  getMesh () {
    return this.mesh
  }

  increaseSize (factor) {
    this.mesh.scale.multiplyScalar(factor)
  }

  setPosition (x, y, z) {
    this.mesh.position.set(x, y, z)
  }

  switchToStandardMaterial (size = 2) {
    const points = this.mesh.children[0]
    const standardMaterial = new THREE.PointsMaterial({
      color: sphere.color,
      size
    })
    points.material = standardMaterial
  }

  switchToShaderMaterial () {
    const points = this.mesh.children[0]
    points.material = this.mat
  }

  setPointsSpeed (speed) {
    this.options.perlin.speed = speed
  }

  setRotationSpeed (speed) {
    this.options.perlin.vel = speed
  }

  getPosition () {
    return this.mesh.position
  }

  hidden () {
    this.mesh.visible = false
  }

  animateSphereSizeIncreaseWithDelay (speed = 10, size = 100) {
    for (let i = 0; i < size; i++) {
      setTimeout(() => {
        this.increaseSize(1.01)
      }, i * speed)
    }
  }

  animateSphereSizeDecrease (decrease = 100) {
    for (let i = 0; i < decrease; i++) {
      this.increaseSize(0.99)
    }
  }
}

export default PerlinNoiseSphere
