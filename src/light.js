import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Router from './router.js'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';

const router = new Router();

let scene, camera, renderer, controls;
let animationId;
let isSceneInitialized = false;
let sphere, cube, torus


function initThreeScene() {
    if (isSceneInitialized) return;
    const canvas = document.querySelector('canvas.light_webgl');
    if (!canvas) return;
    scene = new THREE.Scene();

    /**
     * Lights
     */
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionLght = new THREE.DirectionalLight(0x00fffc, 0.3);
    directionLght.position.set(1, .25, 0);
    scene.add(directionLght);

    const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3);
    scene.add(hemisphereLight);

    const pointLight = new THREE.PointLight(0xff9000, .5, 10, 2);
    pointLight.position.set(1, -.5, 1);
    scene.add(pointLight);

    const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 5, 1, 1);
    rectAreaLight.position.set(-1.5, 0, 1.5);
    rectAreaLight.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(rectAreaLight);

    const spotLight = new THREE.SpotLight(0x78ff00, 1, 8, Math.PI * 0.1, 0.25, 1);
    spotLight.position.set(0, 2, 3);
    scene.add(spotLight);

    spotLight.target.position.set(-1, 0, 0);
    scene.add(spotLight.target);


    // helper
    const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2);
    scene.add(hemisphereLightHelper);

    const spotLightHelper = new THREE.SpotLightHelper(spotLight);
    scene.add(spotLightHelper);

    const directionalLightHelper = new THREE.DirectionalLightHelper(directionLght, 0.2);
    scene.add(directionalLightHelper);

    const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
    scene.add(pointLightHelper);

    const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight, 0.2);
    scene.add(rectAreaLightHelper);

    /**
     * Objects
     */
    // Material
    const material = new THREE.MeshStandardMaterial();
    material.roughness = 0.4;

    // Objects
    sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 32, 32),
        material
    );
    sphere.position.x = -1.5;

    cube = new THREE.Mesh(
        new THREE.BoxGeometry(0.75, 0.75, 0.75),
        material
    );

    torus = new THREE.Mesh(
        new THREE.TorusGeometry(0.3, 0.2, 32, 64),
        material
    );
    torus.position.x = 1.5;

    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(5, 5),
        material
    );
    plane.rotation.x = -Math.PI * 0.5;
    plane.position.y = -0.65;

    scene.add(sphere, cube, torus, plane);

    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    };

    window.addEventListener('resize', () => {
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;

        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();

        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    /**
     * Camera
     */
    // Base camera
    camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
    camera.position.x = 1;
    camera.position.y = 1;
    camera.position.z = 2;
    scene.add(camera);

    // Controls
    controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    /**
     * Renderer
     */
    renderer = new THREE.WebGLRenderer({
        canvas: canvas
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    isSceneInitialized = true;
}
const clock = new THREE.Clock();

function animate() {
    animationId = window.requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime;
    cube.rotation.y = 0.1 * elapsedTime;
    torus.rotation.y = 0.1 * elapsedTime;

    sphere.rotation.x = 0.15 * elapsedTime;
    cube.rotation.x = 0.15 * elapsedTime;
    torus.rotation.x = 0.15 * elapsedTime;

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

    if (currentRoute === 'light') {
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