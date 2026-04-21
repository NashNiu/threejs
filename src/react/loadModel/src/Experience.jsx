import { OrbitControls } from "@react-three/drei";
import { Perf } from "r3f-perf";
import Model from "./model";
import { Suspense } from "react";

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

      <directionalLight castShadow position={[1, 2, 3]} intensity={4.5} />
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
      <Suspense
        fallback={
          <mesh position-y={0.5} scale={[2, 3, 3]}>
            <boxGeometry args={[1, 1, 1, 2, 2, 2]} />
            <meshBasicMaterial wireframe color="red" />
          </mesh>
        }
      >
        <Model />
      </Suspense>
    </>
  );
}
