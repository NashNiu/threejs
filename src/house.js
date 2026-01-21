import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Timer } from "three/addons/misc/Timer.js";
import Router from "./router.js";

const router = new Router();

let scene, camera, renderer, controls;
let animationId = null;
let isSceneInitialized = false;
let timer;
let sizes;

function initThreeScene() {
  if (isSceneInitialized) return;
  const canvas = document.querySelector("canvas.house_webgl");
  if (!canvas) return;

  scene = new THREE.Scene();
  // floor
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial(),
  );
  floor.rotation.x = -Math.PI * 0.5;
  scene.add(floor);
  // house containers
  const house = new THREE.Group();
  scene.add(house);

  // walls
  const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial(),
  );
  walls.position.y = 1.25;
  house.add(walls);

  //roofs
  const roofs = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1.5, 4),
    new THREE.MeshStandardMaterial(),
  );
  roofs.position.y = 2.5 + 0.75;
  roofs.rotation.y = -Math.PI * 0.25;
  house.add(roofs);

  // door
  const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2),
    new THREE.MeshStandardMaterial({ color: "#8b4513" }),
  );
  door.position.y = 1;
  door.position.z = 2.001;
  house.add(door);

  // bush
  const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
  const bushMaterial = new THREE.MeshStandardMaterial();
  const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
  bush1.position.set(0.8, 0.2, 2.2);
  bush1.scale.set(0.5, 0.5, 0.5);

  const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
  bush2.position.set(1.4, 0.1, 2.1);
  bush2.scale.set(0.25, 0.25, 0.25);

  const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
  bush3.position.set(-0.8, 0.1, 2.2);
  bush3.scale.set(0.4, 0.4, 0.4);

  const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
  bush4.position.set(-1, 0.05, 2.6);
  bush4.scale.set(0.15, 0.15, 0.15);
  house.add(bush1, bush2, bush3, bush4);

  // graves
  const gravesGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
  const gravesMaterial = new THREE.MeshStandardMaterial();

  const graves = new THREE.Group();
  scene.add(graves);

  for (let i = 0; i < 30; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 3 + Math.random() * 4;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const grave = new THREE.Mesh(gravesGeometry, gravesMaterial);
    grave.position.set(x, 0.4 * Math.random(), z);
    grave.rotation.x = (Math.random() - 0.5) * 0.4;
    grave.rotation.y = (Math.random() - 0.5) * 0.4;
    grave.rotation.z = (Math.random() - 0.5) * 0.4;
    graves.add(grave);
  }

  const ambientLight = new THREE.AmbientLight("#ffffff", 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight("#ffffff", 1.5);
  directionalLight.position.set(3, 2, -8);
  scene.add(directionalLight);

  sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100,
  );
  camera.position.x = 4;
  camera.position.y = 2;
  camera.position.z = 5;
  scene.add(camera);

  controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  timer = new Timer();
  isSceneInitialized = true;
}

function animate() {
  animationId = window.requestAnimationFrame(animate);
  timer.update();
  const elapsedTime = timer.getElapsed();
  controls.update();
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
  if (currentRoute === "house") {
    setTimeout(() => {
      initThreeScene();
      startAnimation();
    }, 50);
  } else {
    stopAnimation();
  }
}

window.addEventListener("hashchange", handleRouteChange);
window.addEventListener("load", handleRouteChange);

