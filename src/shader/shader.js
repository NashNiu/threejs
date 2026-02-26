import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Router from '../router.js'
import testVertexShader from './test/vertex.glsl'
import testFragmentShader from './test/fragment.glsl'
import GUI from 'lil-gui'

const router = new Router()

let scene, camera, renderer, mesh, controls, material, gui
let animationId = null
let isSceneInitialized = false

function initThreeScene() {
    if (isSceneInitialized) return
    const canvas = document.querySelector('canvas.shader_webgl')
    if (!canvas) return

    // Debug
    gui = new GUI()

    scene = new THREE.Scene()
    /**
     * Textures
     */
    const textureLoader = new THREE.TextureLoader()
    const flagTexture = textureLoader.load('/textures/china.png')
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
    material = new THREE.ShaderMaterial({
        vertexShader: testVertexShader,
        fragmentShader: testFragmentShader,
        // transparent: true,
        // wireframe: true,  
        uniforms: {
            uFrequency: { value: new THREE.Vector2(10, 5) },
            uTime: { value: 0 },
            uColor: { value: new THREE.Color('orange') },
            uTexture: { value: flagTexture },
        }
    })
    gui.add(material.uniforms.uFrequency.value, 'x').min(0).max(20).step(0.01).name('frequencyX')
    gui.add(material.uniforms.uFrequency.value, 'y').min(0).max(20).step(0.01).name('frequencyY')
    // Mesh
    mesh = new THREE.Mesh(geometry, material)
    mesh.scale.y = 2 / 3
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
    material.uniforms.uTime.value = elapsedTime

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
