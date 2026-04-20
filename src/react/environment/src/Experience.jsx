import { useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  useHelper,
  BakeShadows,
  SoftShadows,
  AccumulativeShadows,
  RandomizedLight,
} from "@react-three/drei";
import { useRef } from "react";
import { Perf } from "r3f-perf";
import * as THREE from "three";
import { useControls } from "leva";

export default function Experience() {
  const cube = useRef();
  const directionalLightRef = useRef();
  useHelper(directionalLightRef, THREE.DirectionalLightHelper, 1);

  useFrame((state, delta) => {
    cube.current.rotation.y += delta * 0.2;
  });

  // const { enabled, ...config } = useControls({
  //   enabled: true,
  //   size: { value: 25, min: 0, max: 100 },
  //   focus: { value: 0, min: 0, max: 2 },
  //   samples: { value: 10, min: 1, max: 20, step: 1 },
  // });
  return (
    <>
      {/* {enabled && <SoftShadows {...config} />} */}
      <BakeShadows />
      <Perf position="top-left" />

      <OrbitControls makeDefault />
      <AccumulativeShadows
        color="#316d39"
        opacity={0.8}
        position={[0, -0.99, 0]}
        scale={10}
        // frames={Infinity}
        // temporal
        // blend={100}
      >
        <RandomizedLight
          amount={8}
          radius={1}
          // ambient={0.5}
          // intensity={1}
          position={[1, 2, 3]}
          // bias={0.001}
        />
      </AccumulativeShadows>
      {/* add to scene */}
      <color args={["ivory"]} attach={"background"} />
      <directionalLight
        ref={directionalLightRef}
        position={[1, 2, 3]}
        intensity={4.5}
        castShadow
        shadow-mapSize={[1024 * 2, 1024 * 2]}
        shadow-camera-near={1}
        shadow-camera-far={10}
        shadow-camera-top={5}
        shadow-camera-right={5}
        shadow-camera-bottom={-5}
        shadow-camera-left={-5}
      />
      <ambientLight intensity={1.5} />

      <mesh castShadow position-x={-2}>
        <sphereGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>

      <mesh castShadow ref={cube} position-x={2} scale={1.5}>
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" />
      </mesh>

      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>
    </>
  );
}
