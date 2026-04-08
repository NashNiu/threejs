import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import GUI from 'lil-gui'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/Addons.js';
import { DotScreenPass } from 'three/examples/jsm/Addons.js';
import { GlitchPass } from 'three/examples/jsm/Addons.js';
import { RGBShiftShader } from 'three/examples/jsm/Addons.js';
import { ShaderPass } from 'three/examples/jsm/Addons.js';
import { GammaCorrectionShader } from 'three/examples/jsm/Addons.js';
import { SMAAPass } from 'three/examples/jsm/Addons.js';
import { UnrealBloomPass } from 'three/examples/jsm/Addons.js';

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()
const textureLoader = new THREE.TextureLoader()

/**
 * Update all materials
 */
const updateAllMaterials = () => {
    scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            child.material.envMapIntensity = 2.5
            child.material.needsUpdate = true
            child.castShadow = true
            child.receiveShadow = true
        }
    })
}

/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
    '/45/textures/environmentMaps/0/px.jpg',
    '/45/textures/environmentMaps/0/nx.jpg',
    '/45/textures/environmentMaps/0/py.jpg',
    '/45/textures/environmentMaps/0/ny.jpg',
    '/45/textures/environmentMaps/0/pz.jpg',
    '/45/textures/environmentMaps/0/nz.jpg'
])

scene.background = environmentMap
scene.environment = environmentMap

/**
 * Models
 */
gltfLoader.load(
    '/45/models/DamagedHelmet/glTF/DamagedHelmet.gltf',
    (gltf) => {
        gltf.scene.scale.set(2, 2, 2)
        gltf.scene.rotation.y = Math.PI * 0.5
        scene.add(gltf.scene)

        updateAllMaterials()
    }
)

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 3, - 2.25)
scene.add(directionalLight)

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

    // update effect composer
    composer.setSize(sizes.width, sizes.height)
    composer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 1, - 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 1.5
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


/**
 * render target
 */
const renderTarget = new THREE.WebGLRenderTarget(
    800,
    600,
    {
        samples: renderer.getPixelRatio() === 1 ? 2 : 0
    }
)

/**
 * post processing
 */
const composer = new EffectComposer(renderer, renderTarget)
composer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
composer.setSize(sizes.width, sizes.height)

const renderPass = new RenderPass(scene, camera)
composer.addPass(renderPass)

const dotScreenPass = new DotScreenPass()
dotScreenPass.enabled = false
composer.addPass(dotScreenPass)

const glitchPass = new GlitchPass()
// glitchPass.goWild = true
glitchPass.enabled = false
composer.addPass(glitchPass)

const rgbShiftPass = new ShaderPass(RGBShiftShader)
rgbShiftPass.enabled = false
composer.addPass(rgbShiftPass)

// bloom pass
const bloomPass = new UnrealBloomPass()
bloomPass.strength = 0.3
bloomPass.radius = 1
bloomPass.threshold = 0.5
// bloomPass.enabled = false
composer.addPass(bloomPass)

gui.add(bloomPass, 'strength').min(0).max(2).step(0.01)
gui.add(bloomPass, 'radius').min(0).max(2).step(0.01)
gui.add(bloomPass, 'threshold').min(0).max(2).step(0.01)
gui.add(bloomPass, 'enabled')

// tint pass
const tintShader = {
    uniforms: {
        tDiffuse: {
            value: null
        },
        uTint: {
            value: null
        }
    },
    vertexShader: `
    varying vec2 vUv;
    void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        vUv = uv;
    }
    `,
    fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec3 uTint;
    varying vec2 vUv;
    void main() {
        vec4 color = texture2D(tDiffuse, vUv);
        color.rgb += uTint;
        gl_FragColor = color;
    }
    `,
}

const tintPass = new ShaderPass(tintShader)
tintPass.material.uniforms.uTint.value = new THREE.Vector3(0.0, 0.0, 0.0)
// tintPass.enabled = false
composer.addPass(tintPass)
gui.add(tintPass.material.uniforms.uTint.value, 'x').min(-1).max(1).step(0.01).name('Red')
gui.add(tintPass.material.uniforms.uTint.value, 'y').min(-1).max(1).step(0.01).name('Green')
gui.add(tintPass.material.uniforms.uTint.value, 'z').min(-1).max(1).step(0.01).name('Blue')

// displacement pass
const displacementShader = {
    uniforms: {
        tDiffuse: {
            value: null
        },
        uNormalMap: {
            value: null
        },
        // uTime: {
        //     value: null
        // }
    },
    vertexShader: `
    varying vec2 vUv;
    void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        vUv = uv;
    }
    `,
    fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform sampler2D uNormalMap;
    varying vec2 vUv;
    // uniform float uTime;
    void main() {
        // vec2 newUv = vec2(
        //         vUv.x, 
        //         vUv.y + sin(vUv.x * 10.5 + uTime) * 0.1
        // );
        vec3 normalColor = texture2D(uNormalMap, vUv).rgb * 2.0 - 1.0;
        vec2 newUv = vUv + normalColor.xy * 0.1;
        vec4 color = texture2D(tDiffuse, newUv);
        vec3 lightDirection = normalize(vec3(-1.0, 1.0, 0.0));
        float lightNess = clamp(dot(normalColor, lightDirection), 0.0, 1.0);
        color.rgb += lightNess * 2.0;
        gl_FragColor = color;    
        }
    `,
}

const displacementPass = new ShaderPass(displacementShader)
displacementPass.material.uniforms.uNormalMap.value = textureLoader.load(
    '/45/textures/interfaceNormalMap.png'
)
// displacementPass.material.uniforms.uTime.value = 0
composer.addPass(displacementPass)

// gamma Correction Pass
const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader)
// gammaCorrectionPass.enabled = false
composer.addPass(gammaCorrectionPass)

// SMAA pass
if (renderer.getPixelRatio() === 1 && !renderer.capabilities.isWebGL2) {
    const smaaPass = new SMAAPass()
    // smaaPass.enabled = false
    composer.addPass(smaaPass)
}

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    // update passes
    // displacementPass.material.uniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    // renderer.render(scene, camera)
    composer.render()

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()