import Fox from "./fox";
import Experience from "../experience";
import Environment from "./environment";
import Floor from "./floor";
export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;


    this.resources.on("ready", () => {
      // setup environment
      this.floor = new Floor()
      this.fox = new Fox()
      this.environment = new Environment()
    });
  }
  update() {
    if (this.fox) {
      this.fox.update()
    }
  }
}

