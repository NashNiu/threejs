"use client";

import * as THREE from "three";
import { useEffect, useRef } from "react";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Gui from "lil-gui";
export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const gui = new Gui();
    if (!canvasRef.current) return;
    const scene = new THREE.Scene();
    const material = new THREE.MeshStandardMaterial();
    const cubeTextureLoader = new THREE.CubeTextureLoader();
    const environmentMapTexture = cubeTextureLoader.load([
      "/textures/environmentMap/nx.png",
      "/textures/environmentMap/px.png",
      "/textures/environmentMap/py.png",
      "/textures/environmentMap/ny.png",
      "/textures/environmentMap/pz.png",
      "/textures/environmentMap/nz.png",
    ]);
    material.envMap = environmentMapTexture;
    material.roughness = 0.2;
    material.metalness = 0.7;
    gui.add(material, "roughness").min(0).max(1).step(0.001);
    gui.add(material, "metalness").min(0).max(1).step(0.001);
    gui.add(material, "aoMapIntensity").min(0).max(10).step(0.001);
    gui.add(material, "displacementScale").min(0).max(1).step(0.0001);
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 64, 64),
      material
    );
    sphere.geometry.setAttribute(
      "uv2",
      new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
    );
    sphere.position.x = -1.5;
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1, 100, 100),
      material
    );
    plane.geometry.setAttribute(
      "uv2",
      new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
    );
    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(0.3, 0.2, 64, 128),
      material
    );
    torus.geometry.setAttribute(
      "uv2",
      new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
    );
    torus.position.x = 1.5;

    scene.add(sphere, plane, torus);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 100);
    pointLight.position.x = 2;
    pointLight.position.y = 3;
    pointLight.position.z = 4;
    scene.add(pointLight);
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const controls = new OrbitControls(camera, canvasRef.current);
    controls.enableDamping = true;
    camera.position.z = 3;
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current! });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.render(scene, camera);
    };
    window.addEventListener("resize", handleResize);

    const clock = new THREE.Clock();
    const tick = () => {
      const elapsedTime = clock.getElapsedTime();
      sphere.rotation.y = elapsedTime * 0.1;
      plane.rotation.y = elapsedTime * 0.1;
      torus.rotation.y = elapsedTime * 0.1;

      sphere.rotation.x = elapsedTime * 0.1;
      plane.rotation.x = elapsedTime * 0.1;
      torus.rotation.x = elapsedTime * 0.1;
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    };
    tick();
    return () => {
      renderer.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef}></canvas>;
}

