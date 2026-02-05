import * as THREE from "three";
import Sizes from "./sizes";
import Time from "./time";
import Camera from "./camera";
import Renderer from "./renderer";
import World from "./world";
let instance;
export default class Fox {
  constructor(canvas) {
    // singleton
    if (instance) {
      return instance;
    }
    instance = this;
    console.log("canvas", canvas);
    this.canvas = canvas;
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.world = new World();
    this.sizes.on("resize", () => {
      this.resize();
    });

    this.time.on("tick", () => {
      this.update();
    });
  }
  resize() {
    this.camera.resize();
    this.renderer.resize();
  }
  update() {
    this.camera.update();
    this.renderer.update();
  }
}

