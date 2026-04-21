import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { DRACOLoader } from "three/examples/jsm/Addons.js";
export default function () {
  const model = useLoader(
    GLTFLoader,
    "../public/FlightHelmet/gltf/FlightHelmet.gltf",
    (loader) => {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("../public/draco/");
      loader.setDRACOLoader(dracoLoader);
    },
  );
  return (
   
      <primitive object={model.scene} scale={5} position-y={-1} />
   
  );
}

