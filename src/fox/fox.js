import Sizes from "./sizes";
import Time from "./time";
export default class Fox {
  constructor(canvas) {
    console.log("canvas", canvas);
    this.canvas = canvas;
    this.sizes = new Sizes();
    this.time = new Time();
    this.sizes.on("resize", () => {
      this.resize();
    });

    this.time.on("tick", () => {
      this.update();
    });
  }
  resize() {
    console.log("resized");
  }
  update() {
    // console.log("ticked");
  }
}

