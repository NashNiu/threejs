import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import Router from '../router.js'
import testVertexShader from './patterns/vertex.glsl'
import testFragmentShader from './patterns/fragment.glsl'

const router = new Router()

let scene, camera, renderer, controls, gui, mesh
let animationId = null
let isSceneInitialized = false

function initThreeScene() {
    if (isSceneInitialized) return
    const canvas = document.querySelector('canvas.shader1_webgl')
    if (!canvas) return

    // Debug
    gui = new GUI()

    // Scene
    scene = new THREE.Scene()

    /**
     * Test mesh
     */
    // Geometry
    const geometry = new THREE.PlaneGeometry(1, 1, 32, 32)
    
    // Material
    const material = new THREE.ShaderMaterial({
        vertexShader: testVertexShader,
        fragmentShader: testFragmentShader,
        side: THREE.DoubleSide
    })

    // Mesh
    mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

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
    camera.position.set(0.25, - 0.25, 1)
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
function animate() {
    animationId = window.requestAnimationFrame(animate)

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

    if (currentRoute === 'shader1') {
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
        isSceneInitialized = false
    }
}

window.addEventListener('hashchange', handleRouteChange)
window.addEventListener('load', handleRouteChange)