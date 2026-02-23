import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Router from '../router.js'
import testVertexShader from './test/vertex.glsl'
import testFragmentShader from './test/fragment.glsl'

console.log(testVertexShader)
const router = new Router()

let scene, camera, renderer, mesh, controls
let animationId = null
let isSceneInitialized = false

function initScene() {
    if (isSceneInitialized) return
    const canvas = document.querySelector('canvas.shader_webgl')
    if (!canvas) return

    scene = new THREE.Scene()
    /**
     * Textures
     */
    const textureLoader = new THREE.TextureLoader()
    /**
     * Test mesh
     */
    // Geometry
    const geometry = new THREE.PlaneGeometry(1, 1, 32, 32)
    const count = geometry.attributes.position.count
    const randoms = new Float32Array(count)
    for (let i = 0; i < count; i++) {
        randoms[i] = Math.random()
    }
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))
    // Material
    const material = new THREE.RawShaderMaterial({
        vertexShader: testVertexShader,
        fragmentShader: testFragmentShader,
        transparent: true,
        // wireframe: true,
    })

    // Mesh
    mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }

    window.addEventListener('resize', () => {
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight

        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix()

        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })

    camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    camera.position.set(0.25, - 0.25, 1)
    scene.add(camera)
    // Controls
    controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true

    renderer = new THREE.WebGLRenderer({
        canvas: canvas
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    isSceneInitialized = true
}

const clock = new THREE.Clock()

function animate() {
    animationId = window.requestAnimationFrame(animate)
    const elapsedTime = clock.getElapsedTime()

    renderer.render(scene, camera)
    // Update controls
    controls.update()
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
    if (currentRoute === 'shader') {
        setTimeout(() => {
            initScene()
            startAnimation()
        }, 50)
    } else {
        stopAnimation()
    }
}

window.addEventListener('hashchange', handleRouteChange)
window.addEventListener('load', handleRouteChange)
