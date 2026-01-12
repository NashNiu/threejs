import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';
import gsap from 'gsap';
const params = {
    materialColor: 0x00ff00,
    spin: () => {
        gsap.to(cube.rotation, { y: cube.rotation.y + Math.PI * 2, duration: 1 });
    }
};
const gui = new GUI();
const scene = new THREE.Scene();
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: params.materialColor });
const cube = new THREE.Mesh(geometry, material);
gui.add(cube.position, 'y', -5, 5, 0.1).name('Cube Y Position');

gui.add(material, 'wireframe').name('Wireframe Mode');
gui.addColor(params, 'materialColor').name('Cube Color').onChange(() => {
    material.color.set(params.materialColor);
});
gui.add(params, 'spin').name('Spin Cube');
scene.add(cube);
const size = {
    width: window.innerWidth,
    height: window.innerHeight
};
window.addEventListener('resize', () => {
    size.width = window.innerWidth;
    size.height = window.innerHeight;
    // Update renderer
    renderer.setSize(size.width, size.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // Update camera
    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();
});
window.addEventListener('dblclick', () => {
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
    // fullscreen
    if (!fullscreenElement) {
        if (canvasDom.requestFullscreen) {
            canvasDom.requestFullscreen();
        } else if (canvasDom.webkitRequestFullscreen) {
            canvasDom.webkitRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
});
const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 100);
const controls = new OrbitControls(camera, document.querySelector('.webgl'));
controls.enableDamping = true;
camera.position.z = 3;
camera.lookAt(cube.position);

const canvasDom = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas: canvasDom });
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const tick = () => {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
};
tick();

