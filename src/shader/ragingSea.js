import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import Router from '../router.js'
import vertexShader from './water/vertex.glsl'
import fragmentShader from './water/fragment.glsl'

const router = new Router()

let scene, camera, renderer, controls, gui, waterMaterial
let animationId = null
let isSceneInitialized = false

const debugObject = {}

function initThreeScene() {
    if (isSceneInitialized) return
    const canvas = document.querySelector('canvas.ragingSea_webgl')
    if (!canvas) return

    // Debug
    gui = new GUI({ width: 340 })

    // Scene
    scene = new THREE.Scene()

    /**
     * Water
     */
    // Geometry
    const waterGeometry = new THREE.PlaneGeometry(2, 2, 500, 500)

    // color
    debugObject.depthColor = '#293642'
    debugObject.surfaceColor = '#9ecdff'

    // Material
    waterMaterial = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
            uTime: { value: 0 },
            
            uBigWavesElevation: { value: 0.2 },
            uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
            uBigWavesSpeed: { value: 0.75 },

            uSmallWavesElevation: { value: 0.15 },
            uSmallWavesFrequency: { value: 3.0 },
            uSmallWavesSpeed: { value: 0.2 },
            uSmallWavesIterations: { value: 4.0 },

            uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
            uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
            uColorOffset: { value: 0.48 },
            uColorMultiplier: { value: 1.05 },
        }
    })

    // Debug
    gui.add(waterMaterial.uniforms.uBigWavesElevation, 'value').min(0).max(1).step(0.01).name('uBigWavesElevation')
    gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x').min(0).max(10).step(0.01).name('uBigWavesFrequencyX')
    gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y').min(0).max(10).step(0.01).name('uBigWavesFrequencyY')
    gui.add(waterMaterial.uniforms.uBigWavesSpeed, 'value').min(0).max(1).step(0.01).name('uBigWavesSpeed')
    gui.add(waterMaterial.uniforms.uColorOffset, 'value').min(0).max(1).step(0.01).name('uColorOffset')
    gui.add(waterMaterial.uniforms.uColorMultiplier, 'value').min(0).max(10).step(0.01).name('uColorMultiplier')
    gui.add(waterMaterial.uniforms.uSmallWavesElevation, 'value').min(0).max(1).step(0.01).name('uSmallWavesElevation')
    gui.add(waterMaterial.uniforms.uSmallWavesFrequency, 'value').min(0).max(30).step(0.01).name('uSmallWavesFrequency')
    gui.add(waterMaterial.uniforms.uSmallWavesSpeed, 'value').min(0).max(4).step(0.01).name('uSmallWavesSpeed')
    gui.add(waterMaterial.uniforms.uSmallWavesIterations, 'value').min(0).max(10).step(1.0).name('uSmallWavesIterations')

    gui.addColor(debugObject, 'depthColor').onChange(() => {
        waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor)
    })
    gui.addColor(debugObject, 'surfaceColor').onChange(() => {
        waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor)
    })

    // Mesh
    const water = new THREE.Mesh(waterGeometry, waterMaterial)
    water.rotation.x = - Math.PI * 0.5
    scene.add(water)

    /**
     * Sizes
     */
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }

    window.addEventListener('resize', () => {
        // Update sizes
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight

        // Update camera
        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix()

        // Update renderer
        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })

    /**
     * Camera
     */
    // Base camera
    camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    camera.position.set(1, 1, 1)
    scene.add(camera)

    // Controls
    controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true

    /**
     * Renderer
     */
    renderer = new THREE.WebGLRenderer({
        canvas: canvas
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    isSceneInitialized = true
}

/**
 * Animate
 */
const clock = new THREE.Clock()

function animate() {
    animationId = window.requestAnimationFrame(animate)

    const elapsedTime = clock.getElapsedTime()
    // Update uniforms
    waterMaterial.uniforms.uTime.value = elapsedTime
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)
}

function startAnimation() {
    if (!animationId) {
        animate()
    }
}

function stopAnimation() {
    if (animationId) {
        window.cancelAnimationFrame(animationId)
        animationId = null
    }
}

function handleRouteChange() {
    const currentRoute = router.getCurrentRoute()

    if (currentRoute === 'ragingSea') {
        setTimeout(() => {
            initThreeScene()
            startAnimation()
        }, 50)
    } else {
        stopAnimation()
        if (gui) {
            gui.destroy()
            gui = null
        }
    }
}

window.addEventListener('hashchange', handleRouteChange)
window.addEventListener('load', handleRouteChange)