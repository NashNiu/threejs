import * as THREE from "three"; 
import Sizes from "./utils/sizes";
import Time from "./utils/time";
import Camera from "./camera";
import Renderer from "./renderer";
import World from "./world/world";
import Resources from "./utils/resources";
import sources from "./sources";
console.log("sources", sources);
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
    this.resources = new Resources(sources);
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

