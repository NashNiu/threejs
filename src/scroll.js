import * as THREE from 'three'
import Router from './router.js'
import GUI from 'lil-gui'
import gsap from 'gsap'

const router = new Router()


let scene, camera, cameraGroup, renderer, mesh1, mesh2, mesh3, material, sectionMeshes
let animationId = null
let isSceneInitialized = false
let scrollY = window.scrollY
const params = {
    materialColor: '#ffeded'
}
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
const objectsDistance = 4
const cursor = {
    x: 0,
    y: 0
}

function initScene() {
    const gui = new GUI()
    gui.addColor(params, 'materialColor').onFinishChange(() => {
        if (!material) return
        material.color.set(params.materialColor)
        particleMaterial.color.set(params.materialColor)
    })
    if (isSceneInitialized) return
    const canvas = document.querySelector('canvas.scroll_webgl')
    if (!canvas) return
    scene = new THREE.Scene()
    /**
     * texture
     */
    const textureLoader = new THREE.TextureLoader()
    const gradientTexture = textureLoader.load('./gradients/3.jpg')
    gradientTexture.magFilter = THREE.NearestFilter

    /**
     * objects
     */
    material = new THREE.MeshToonMaterial({
        color: params.materialColor,
        gradientMap: gradientTexture
    })
    mesh1 = new THREE.Mesh(
        new THREE.TorusGeometry(1, 0.4, 16, 60),
        material
    )

    mesh2 = new THREE.Mesh(
        new THREE.ConeGeometry(1, 2, 32),
        material
    )

    mesh3 = new THREE.Mesh(
        new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
        material
    )
    mesh1.position.y = -objectsDistance * 0
    mesh2.position.y = -objectsDistance * 1
    mesh3.position.y = -objectsDistance * 2

    mesh1.position.x = 2
    mesh2.position.x = -2
    mesh3.position.x = 2

    scene.add(mesh1, mesh2, mesh3)

    sectionMeshes = [mesh1, mesh2, mesh3]

    /**
     * particles
     */
    const particleCount = 200
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 10
        positions[i * 3 + 1] = objectsDistance * 0.5 - objectsDistance * sectionMeshes.length * Math.random()
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    const particleGeometry = new THREE.BufferGeometry()
    const particleMaterial = new THREE.PointsMaterial({
        color: params.materialColor,
        sizeAttenuation: true,
        size: 0.02
    })
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const particles = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particles)
    /**
     * lights
     */
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(1, 1, 0)
    scene.add(directionalLight)

    window.addEventListener('resize', () => {
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight

        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix()

        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })

    let currentSection = 0
    window.addEventListener('scroll', () => {
        scrollY = window.scrollY
        const newSection = Math.round(scrollY / sizes.height)
        if (newSection !== currentSection) {
            currentSection = newSection
            gsap.to(
                sectionMeshes[currentSection].rotation,
                {
                    duration: 1.5,
                    ease: 'power3.inOut',
                    y: '+=6',
                    x: '+=3',
                    z: '+=1.5'
                })
        }
    })
    window.addEventListener('mousemove', (e) => {
        cursor.x = e.clientX / sizes.width - 0.5
        cursor.y = e.clientY / sizes.height - 0.5
    })

    cameraGroup = new THREE.Group()
    camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
    camera.position.z = 6
    cameraGroup.add(camera)
    scene.add(cameraGroup)

    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    isSceneInitialized = true
}

const clock = new THREE.Clock()
let previousTime = 0
function animate() {
    animationId = window.requestAnimationFrame(animate)
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime
    camera.position.y = -scrollY / sizes.height * objectsDistance

    const parallaxX = cursor.x * 0.5
    const parallaxY = -cursor.y * 0.5
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime

    for (const mesh of sectionMeshes) {
        mesh.rotation.x += deltaTime * 0.1
        mesh.rotation.y += deltaTime * 0.12
    }

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
    if (currentRoute === 'scroll') {
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
