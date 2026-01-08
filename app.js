import * as THREE from 'three';
import gsap from 'gsap';
const scene = new THREE.Scene();
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);

scene.add(cube);
const size = {
    width: 800,
    height: 600
};
const camera = new THREE.PerspectiveCamera(45, size.width / size.height, 0.1, 1000);
camera.position.z = 5;
const canvasDom = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas: canvasDom });
renderer.setSize(size.width, size.height);

// const time = Date.now();
// const tick = () => {
//     const currentTime = Date.now();
//     const deltaTime = currentTime - time;   
//     cube.rotation.y = 0.001 * deltaTime;
//     renderer.render(scene, camera);
//     requestAnimationFrame(tick);
// }
// tick();
gsap.to(cube.position, { duration: 1, delay: 1, x: 2 });
gsap.to(cube.position, { duration: 1, delay: 2, x: 0 });
const clock = new THREE.Clock();
const tick = () => {
    // const elapsedTime = clock.getElapsedTime();
    // // cube.rotation.y = elapsedTime;
    // cube.position.y = Math.sin(elapsedTime);
    // // cube.rotation.y = elapsedTime;
    // cube.position.x = Math.cos(elapsedTime);
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
};
tick();