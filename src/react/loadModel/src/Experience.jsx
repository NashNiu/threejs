import { OrbitControls } from "@react-three/drei";
import { Perf } from "r3f-perf";
import Model from "./model";
import { Suspense } from "react";
import Placeholder from "./placeholder";
import Hamburger from "./hamburger";
import Fox from "./fox";

export default function Experience() {
  // const model = useLoader(
  //   GLTFLoader,
  //   "../public/FlightHelmet/gltf/FlightHelmet.gltf",
  //   (loader) => {
  //     const dracoLoader = new DRACOLoader();
  //     dracoLoader.setDecoderPath("../public/draco/");
  //     loader.setDRACOLoader(dracoLoader);
  //   },
  // );
  // console.log(model);
  return (
    <>
      <Perf position="top-left" />

      <OrbitControls makeDefault />

      <directionalLight castShadow position={[1, 2, 3]} intensity={1.5} shadow-normalBias={0.04} />
      <ambientLight intensity={1.5} />

      <mesh
        receiveShadow
        position-y={-1}
        rotation-x={-Math.PI * 0.5}
        scale={10}
      >
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>
      <Suspense fallback={<Placeholder position-y={0.5} scale={[2, 3, 3]} />}>
        <Hamburger scale={[0.35, 0.35, 0.35]} />
      </Suspense>
      <Fox></Fox>
    </>
  );
}
