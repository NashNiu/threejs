import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import Router from './router.js'

/**
 * Base
 */
// Debug
// const gui = new GUI()

const router = new Router();
// /**
//  * Camera
//  */
// // Base camera
// const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
// camera.position.z = 3
// scene.add(camera)

// // Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

// /**
//  * Renderer
//  */
// const renderer = new THREE.WebGLRenderer({
//     canvas: canvas
// })
// renderer.setSize(sizes.width, sizes.height)
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// /**
//  * Animate
//  */
// const clock = new THREE.Clock()

// const tick = () => {
//     const elapsedTime = clock.getElapsedTime()

//     // Update controls
//     controls.update()

//     // Render
//     renderer.render(scene, camera)

//     // Call tick again on the next frame
//     window.requestAnimationFrame(tick)
// }

// tick()

let isSceneInitialized = false;
let animationId = null;
let renderer = null;
let controls = null;
let scene = null
let camera = null;


function initParticlesScene() {
    if (isSceneInitialized) return;

    const canvas = document.querySelector("canvas.particles_webgl");
    if (!canvas) return;

    scene = new THREE.Scene();

    const textureLoader = new THREE.TextureLoader();
    /**
     * Test cube
     */
    const cube = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial()
    )
    scene.add(cube)
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
    camera.position.z = 3
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
}

function animate() {
    animationId = requestAnimationFrame(animate);
    // Update controls
    controls.update();
    // Render
    renderer.render(scene, camera);
}

function startAnimation() {
    if (!animationId) {
        animate()
    }
}

function stopAnimation() {
    if (animationId) {
        window.cancelAnimationFrame(animationId);
        animationId = null;
    }
}
function handleRouteChange(route) {
    const currentRoute = router.getCurrentRoute();
    if (currentRoute === 'particles') {
        initParticlesScene();
        startAnimation();
    } else {
        stopAnimation();
    }
}

window.addEventListener('hashchange', handleRouteChange);
window.addEventListener('load', handleRouteChange);