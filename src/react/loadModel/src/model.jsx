import { useLoader } from "@react-three/fiber";
import { useGLTF, Clone } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { DRACOLoader } from "three/examples/jsm/Addons.js";
export default function () {
  // const model = useLoader(
  //   GLTFLoader,
  //   // "../public/FlightHelmet/gltf/FlightHelmet.gltf",
  //   "../public/hamburger.glb",
  //   (loader) => {
  //     const dracoLoader = new DRACOLoader();
  //     dracoLoader.setDecoderPath("../public/draco/");
  //     loader.setDRACOLoader(dracoLoader);
  //   },
  // );
  const model = useGLTF("../public/hamburger-draco.glb");
  return (
    <>
      <Clone object={model.scene} scale={0.35} position-x={-4} />
      <Clone object={model.scene} scale={0.35} position-x={0} />
      <Clone object={model.scene} scale={0.35} position-x={4} />
    </>
  );
}
