import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import Router from './router.js'

const router = new Router()

let scene, camera, renderer, controls
let animationId = null
let isSceneInitialized = false
let gui, environmentMap
const debugObject = {}
/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()
const rgbeLoader = new RGBELoader()

function initScene() {
    if (isSceneInitialized) return
    const canvas = document.querySelector('canvas.realistic_webgl')
    if (!canvas) return
    /**
     * Base
     */
    // Debug
    gui = new GUI()

    scene = new THREE.Scene()

    /**
     * light
     */
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(0.25, 3, -2.25)
    directionalLight.castShadow = true
    directionalLight.shadow.camera.far = 15
    directionalLight.shadow.mapSize.set(1024, 1024)
    // reduce shadow acne
    directionalLight.shadow.normalBias = 0.05
    // const directionLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
    // scene.add(directionLightCameraHelper)
    scene.add(directionalLight)
    gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity')
    gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001).name('lightX')
    gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.001).name('lightY')
    gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001).name('lightZ')

    /**
     * Update all materials
     */
    const updateAllMaterials = () => {
        scene.traverse((child) => {
            if (child.isMesh && child.material.isMeshStandardMaterial) {
                // child.material.envMap = environmentMap
                child.material.envMapIntensity = debugObject.envMapIntensity
                child.material.needsUpdate = true
                child.castShadow = true
                child.receiveShadow = true
            }
        })
    }
    /**
     * environment map
     */
    environmentMap = cubeTextureLoader.load([
        '/environmentMaps/0/px.png',
        '/environmentMaps/0/nx.png',
        '/environmentMaps/0/py.png',
        '/environmentMaps/0/ny.png',
        '/environmentMaps/0/pz.png',
        '/environmentMaps/0/nz.png'
    ])
    environmentMap.encoding = THREE.sRGBEncoding
    scene.background = environmentMap
    scene.environment = environmentMap
    debugObject.envMapIntensity = 5


    gui.add(debugObject, 'envMapIntensity')
        .min(0).max(10).step(0.001).name('envMapIntensity').onChange(updateAllMaterials)
    /**
     * Models
     */
    // Helmet
    gltfLoader.load(
        '/models/hamburger.glb',
        (gltf) => {
            gltf.scene.scale.set(0.3, 0.3, 0.3)
            gltf.scene.position.set(0, -1, 0)
            gltf.scene.rotation.set(0, Math.PI * 0.5, 0)
            scene.add(gltf.scene)
            gui.add(gltf.scene.rotation, 'y').min(-Math.PI).max(Math.PI).step(0.001).name('hamburgerY')
            updateAllMaterials()
        }
    )

    /**
 * Environment map
 */
    // Intensity
    // scene.environmentIntensity = 1
    // gui
    //     .add(scene, 'environmentIntensity')
    //     .min(0)
    //     .max(10)
    //     .step(0.001)

    // HDR (RGBE) equirectangular
    // rgbeLoader.load('/environmentMaps/0/2k.hdr', (environmentMap) => {
    //     environmentMap.mapping = THREE.EquirectangularReflectionMapping

    //     scene.background = environmentMap
    //     scene.environment = environmentMap
    // })


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
    /**
     * Camera
     */
    // Base camera
    camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    camera.position.set(4, 1, -4)
    scene.add(camera)
    // Controls
    controls = new OrbitControls(camera, canvas)
    // controls.target.y = 3.5
    controls.enableDamping = true

    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.physicallyCorrectLights = true
    renderer.outputEncoding = THREE.sRGBEncoding
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 3
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFShadowMap

    gui.add(renderer, 'toneMapping').options({
        NoToneMapping: THREE.NoToneMapping,
        LinearToneMapping: THREE.LinearToneMapping,
        ReinhardToneMapping: THREE.ReinhardToneMapping,
        CineonToneMapping: THREE.CineonToneMapping,
        ACESFilmicToneMapping: THREE.ACESFilmicToneMapping
    })
    gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001).name('toneMappingExposure')
    isSceneInitialized = true
}
const clock = new THREE.Clock()

function animate() {
    animationId = window.requestAnimationFrame(animate)
    const elapsedTime = clock.getElapsedTime()

    controls.update()
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
    if (currentRoute === 'realistic') {
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
