import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { GPUComputationRenderer } from 'three/examples/jsm/Addons.js'
import GUI from 'lil-gui'
import particlesVertexShader from './shaders/particles/vertex.glsl'
import particlesFragmentShader from './shaders/particles/fragment.glsl'
import gpGpuParticlesShader from './shaders/gpgpu/particles.glsl'

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 })
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Loaders
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/41/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    sizes.pixelRatio = Math.min(window.devicePixelRatio, 2)

    // Materials
    particles.material.uniforms.uResolution.value.set(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(sizes.pixelRatio)
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4.5, 4, 11)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(sizes.pixelRatio)

debugObject.clearColor = '#29191f'
renderer.setClearColor(debugObject.clearColor)

/**
 * base geometry
 */
const baseGeometry = {}
baseGeometry.instance = new THREE.SphereGeometry(3)
baseGeometry.count = baseGeometry.instance.attributes.position.count

/**
 * gpu computer
 */
// set up
const gpGpu = {}
gpGpu.size = Math.ceil(Math.sqrt(baseGeometry.count))
gpGpu.computation = new GPUComputationRenderer(gpGpu.size, gpGpu.size, renderer)

// base particle
const baseParticlesTexture = gpGpu.computation.createTexture()

for (let i = 0; i < baseGeometry.count; i++) {
    const i3 = i * 3
    const i4 = i * 4
    baseParticlesTexture.image.data[i4] = baseGeometry.instance.attributes.position.array[i3]
    baseParticlesTexture.image.data[i4 + 1] = baseGeometry.instance.attributes.position.array[i3 + 1]
    baseParticlesTexture.image.data[i4 + 2] = baseGeometry.instance.attributes.position.array[i3 + 2]
    baseParticlesTexture.image.data[i4 + 3] = 0.0
}

// PARTICLES variables
gpGpu.particlesVariable = gpGpu.computation.addVariable('uParticles', gpGpuParticlesShader, baseParticlesTexture)
gpGpu.computation.setVariableDependencies(gpGpu.particlesVariable, [gpGpu.particlesVariable])

// init 
gpGpu.computation.init()


// debug
gpGpu.debug = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 3),
    new THREE.MeshBasicMaterial({ map: gpGpu.computation.getCurrentRenderTarget(gpGpu.particlesVariable).texture })
)
gpGpu.debug.position.x = 3
scene.add(gpGpu.debug)

/**
 * Particles
 */
const particles = {}

// Geometry
const particlesUvArray = new Float32Array(baseGeometry.count * 2)
for (let y = 0; y < gpGpu.size; y++) {
    for (let x = 0; x < gpGpu.size; x++) {
        const i = y * gpGpu.size + x
        const i2 = i * 2
        const uvX = (x + 0.5) / gpGpu.size
        const uvY = (y + 0.5) / gpGpu.size
        particlesUvArray[i2] = uvX
        particlesUvArray[i2 + 1] = uvY
    }
}
particles.geometry = new THREE.BufferGeometry()
particles.geometry.setDrawRange(0, baseGeometry.count)
particles.geometry.setAttribute('aParticlesUv', new THREE.BufferAttribute(particlesUvArray, 2))

// Material
particles.material = new THREE.ShaderMaterial({
    vertexShader: particlesVertexShader,
    fragmentShader: particlesFragmentShader,
    uniforms:
    {
        uSize: new THREE.Uniform(0.4),
        uResolution: new THREE.Uniform(new THREE.Vector2(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)),
        uParticlesTexture: new THREE.Uniform()
    }
})

// Points
particles.points = new THREE.Points(particles.geometry, particles.material)
scene.add(particles.points)

/**
 * Tweaks
 */
gui.addColor(debugObject, 'clearColor').onChange(() => { renderer.setClearColor(debugObject.clearColor) })
gui.add(particles.material.uniforms.uSize, 'value').min(0).max(1).step(0.001).name('uSize')

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update controls
    controls.update()
    // Update gpu computer
    gpGpu.computation.compute()
    particles.material.uniforms.uParticlesTexture.value = gpGpu.computation.getCurrentRenderTarget(gpGpu.particlesVariable).texture

    // Render normal scene
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()