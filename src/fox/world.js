import * as THREE from "three";
import Fox from "./fox";

export default class World {
  constructor() {
    this.fox = new Fox();
    this.scene = this.fox.scene;
    const testMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true }),
    );
    this.scene.add(testMesh);
  }
}

