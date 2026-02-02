import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Router from './router.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';

const router = new Router();

let scene, camera, renderer, controls, gui;
let animationId;
let isSceneInitialized = false;
let torusKnot;
let guiParams = {
    envMapIntensity: 0,
}

function initThreeScene() {
    if (isSceneInitialized) return;
    const canvas = document.querySelector('canvas.environmentMap_webgl');
    if (!canvas) return;
    const gltfLoader = new GLTFLoader()
    // const cubeTextureLoader = new THREE.CubeTextureLoader()
    // const rgbeLoader = new RGBELoader()
    const exrLoader = new EXRLoader()
    /**
     * Base
     */
    // Scene
    scene = new THREE.Scene()

    /**
     * update all materials
     */
    const updateAllMaterials = () => {
        scene.traverse((child) => {
            if (child.isMesh && child.material.isMeshStandardMaterial) {
                // child.material.envMap = environmentMap
                // child.material.envMapIntensity = guiParams.envMapIntensity
            }
        })
    }

    // Debug
    gui = new GUI()
    gui.add(guiParams, 'envMapIntensity').min(0).max(10).step(0.01).onChange(() => {
        updateAllMaterials()
    })
    gui.add(scene, 'backgroundBlurriness').min(0).max(1).step(0.001).onChange(updateAllMaterials)
    gui.add(scene, 'backgroundIntensity').min(0).max(10).step(0.01)
    /**
     *  ENVIRONMENT MAP
     */
    // const environmentMap = cubeTextureLoader.load([
    //     './environmentMaps/0/px.png',
    //     './environmentMaps/0/nx.png',
    //     './environmentMaps/0/py.png',
    //     './environmentMaps/0/ny.png',
    //     './environmentMaps/0/pz.png',
    //     './environmentMaps/0/nz.png'
    // ])
    // // scene.environment = environmentMap
    // scene.background = environmentMap
    scene.backgroundBlurriness = 0
    scene.backgroundIntensity = 1

    // // hdre loader
    // rgbeLoader.load('./environmentMaps/blender-2k.hdr',(environmentMap)=>{
    //     environmentMap.mapping = THREE.EquirectangularReflectionMapping
    //     scene.environment = environmentMap
    //     scene.background = environmentMap
    // })
    exrLoader.load('./environmentMaps/nvidiaCanvas-4k.exr',(environmentMap)=>{
        environmentMap.mapping = THREE.EquirectangularReflectionMapping
        scene.environment = environmentMap
        scene.background = environmentMap
    })

    /**
     * Torus Knot
     */
    torusKnot = new THREE.Mesh(
        new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
        new THREE.MeshStandardMaterial({
            roughness: 0.1,
            metalness: 1,
            color: 0xaaaaaa
        })
    )
    torusKnot.position.x = -4
    torusKnot.position.y = 4
    scene.add(torusKnot)

    /**
     * models
     */
    // static\models\FlightHelmet\glTF\FlightHelmet.gltf
    const gltfModelPath = './models/FlightHelmet/glTF/FlightHelmet.gltf'
    gltfLoader.load(gltfModelPath, (gltf) => {
        const model = gltf.scene
        model.scale.set(10, 10, 10)
        scene.add(model)
        updateAllMaterials()
    })

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
    camera.position.set(4, 5, 4)
    scene.add(camera)

    // Controls
    controls = new OrbitControls(camera, canvas)
    controls.target.y = 3.5
    controls.enableDamping = true

    /**
     * Renderer
     */
    renderer = new THREE.WebGLRenderer({
        canvas: canvas
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    isSceneInitialized = true;
}

const clock = new THREE.Clock()

function animate() {
    animationId = window.requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);
}

function startAnimation() {
    if (!animationId) {
        animate();
    }
}

function stopAnimation() {
    if (animationId) {
        window.cancelAnimationFrame(animationId);
        animationId = null;
    }
}

function handleRouteChange() {
    const currentRoute = router.getCurrentRoute();

    if (currentRoute === 'environmentMap') {
        setTimeout(() => {
            initThreeScene();
            startAnimation();
        }, 50);
    } else {
        stopAnimation();
    }
}

window.addEventListener('hashchange', handleRouteChange);
window.addEventListener('load', handleRouteChange);