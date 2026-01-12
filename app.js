import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
const scene = new THREE.Scene();
// const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);

const geometry = new THREE.BufferGeometry();
// const positions = new Float32Array([
//     0, 0, 0,
//     0, 1, 0,
//     1, 0, 0,
// ]);
// const positionAttribute = new THREE.BufferAttribute(positions, 3);

// geometry.setAttribute('position', positionAttribute);
const count = 5000;
const positionArray = new Float32Array(count * 3 * 3);
for (let i = 0; i < count * 3 * 3; i++) {
    positionArray[i] = (Math.random() - 0.5) * 4;
}
const positionAttribute = new THREE.BufferAttribute(positionArray, 3);
geometry.setAttribute('position', positionAttribute);

const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
const cube = new THREE.Mesh(geometry, material);

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

