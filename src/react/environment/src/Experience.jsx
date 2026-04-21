import { useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  useHelper,
  BakeShadows,
  SoftShadows,
  AccumulativeShadows,
  RandomizedLight,
  ContactShadows,
  Sky,
  Environment,
  Lightformer,
  Stage,
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
    // cube.current.position.x = Math.sin(state.clock.getElapsedTime()) + 2;
    cube.current.rotation.y += delta * 0.2;
  });

  // const { enabled, ...config } = useControls({
  //   enabled: true,
  //   size: { value: 25, min: 0, max: 100 },
  //   focus: { value: 0, min: 0, max: 2 },
  //   samples: { value: 10, min: 1, max: 20, step: 1 },
  // });
  const { color, opacity, blur } = useControls("contact shadows", {
    color: "#1d8f75",
    opacity: { value: 0.4, min: 0, max: 1 },
    blur: { value: 2.8, min: 0, max: 10 },
  });
  const { sunPosition } = useControls("sky", {
    sunPosition: { value: [1, 2, 3] },
  });
  const { envMapIntensity, envMapHeight, envMapRadius, envMapScale } =
    useControls("environment map", {
      envMapIntensity: { value: 3.5, min: 0, max: 10 },
      envMapHeight: { value: 7, min: 0, max: 20 },
      envMapRadius: { value: 20, min: 10, max: 1000 },
      envMapScale: { value: 100, min: 0, max: 200 },
    });
  return (
    <>
      {/* <Environment
        background
        // files="../public/environmentMaps/the_sky_is_on_fire_2k.hdr"
        environmentIntensity={envMapIntensity}
        preset="sunset"
        ground={{
          height: envMapHeight,
          radius: envMapRadius,
          scale: envMapScale,
        }} */}
      {/* // resolution={32} */}
      {/* > */}
      {/* <color args={["#000000"]} attach={"background"} />
        <Lightformer
          position={[0, 0, -5]}
          scale={10}
          color="red"
          intensity={10}
          form={"ring"}
        /> */}
      {/* <mesh position-z={-5} scale={10}>
          <planeGeometry />
          <meshBasicMaterial color={[100, 0, 0]} />
        </mesh> */}
      {/* </Environment> */}
      {/* {enabled && <SoftShadows {...config} />}
      <BakeShadows /> */}
      <Perf position="top-left" />

      <OrbitControls makeDefault />
      {/* <AccumulativeShadows
        color="#316d39"
        opacity={0.8}
        position={[0, -0.99, 0]}
        scale={10}
        temporal
        frames={Infinity}
        blend={100}
      >
        <RandomizedLight
          amount={4}
          radius={1}
          ambient={0.5}
          intensity={1}
          position={[1, 2, 3]}
          bias={0.001}
        />
      </AccumulativeShadows> */}
      {/* add to scene */}
      <color args={["ivory"]} attach={"background"} />

      {/* <ContactShadows
        position={[0, 0, 0]}
        scale={10}
        resolution={512}
        far={5}
        color={color}
        opacity={opacity}
        blur={blur}
        frames={1}
      /> */}
      {/* <directionalLight
        ref={directionalLightRef}
        position={sunPosition}
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
      <Sky sunPosition={sunPosition} /> */}
      {/* <mesh castShadow position-x={-2} position-y={1}>
        <sphereGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>

      <mesh castShadow ref={cube} position-x={2} position-y={1} scale={1.5}>
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" />
      </mesh> */}

      {/* <mesh position-y={0} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh> */}
      <Stage
        shadows={{ type: "contact", opacity: 0.2, blur: 2 }}
        environment="sunset"
        preset={"portrait"}
        intensity={10}
      >
        <mesh castShadow ref={cube} position-x={2} position-y={1} scale={1.5}>
          <boxGeometry />
          <meshStandardMaterial color="mediumpurple" />
        </mesh>
        <mesh castShadow position-x={-2} position-y={1}>
          <sphereGeometry />
          <meshStandardMaterial color="orange" />
        </mesh>
      </Stage>
    </>
  );
}
