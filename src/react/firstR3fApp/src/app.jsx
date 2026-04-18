import { useFrame, extend, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import CustomObject from "./customObject.jsx";

extend({ OrbitControls });

export default function App() {
  const cubeRef = useRef();
  const groupRef = useRef();
  const { camera, gl } = useThree();
  useFrame((state, delta) => {
    // const time = state.clock.getElapsedTime();
    // state.camera.position.x = Math.sin(time) * 10;
    // state.camera.position.z = Math.cos(time) * 10;
    // state.camera.lookAt(0, 0, 0)
    cubeRef.current.rotation.y += delta;
    // groupRef.current.rotation.y += delta;
  });
  return (
    <>
      <orbitControls args={[camera, gl.domElement]} />
      <directionalLight position={[1, 2, 3]} intensity={1.5} />
      <ambientLight intensity={0.5} />
      <group ref={groupRef}>
        <mesh position-x={-2}>
          <sphereGeometry />
          <meshStandardMaterial color="orange" />
        </mesh>
        <mesh ref={cubeRef} scale={1.5} position-x={2} rotation-y={Math.PI / 2}>
          <boxGeometry />
          <meshStandardMaterial color="mediumpurple" />
        </mesh>
      </group>
      <mesh position-y={-1} rotation-x={-Math.PI / 2} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>
      <CustomObject />
    </>
  );
}

