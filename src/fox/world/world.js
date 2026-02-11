import * as THREE from "three";
import Fox from "../fox";
import Environment from "./environment";
export default class World {
  constructor() {
    this.fox = new Fox();
    this.scene = this.fox.scene;
    this.resources = this.fox.resources;

    const testMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial(),
    );
    this.scene.add(testMesh);
    this.resources.on("ready", () => {
      // setup environment
      this.environment = new Environment()
    });
  }
}

