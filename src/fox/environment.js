import * as THREE from "three";
import Fox from "./fox";


export default class Environment {
    constructor() {
        this.fox = new Fox()
        this.scene = this.fox.scene
        this.setSunLight()
    }
    setSunLight() {
        this.sunLight = new THREE.DirectionalLight("#ffffff", 4);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.camera.far = 15;
        this.sunLight.shadow.mapSize.set(1024, 1024);
        this.sunLight.shadow.normalBias = 0.05;
        this.sunLight.position.set(3.5, 2, -1.25);
        this.scene.add(this.sunLight);
    }
}