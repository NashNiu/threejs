import { useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, meshBounds } from "@react-three/drei";
import { useRef } from "react";

export default function Experience() {
  const cube = useRef();
  const model = useGLTF("../public/hamburger.glb");
  console.log(model);
  const eventHandler = (event) => {
    console.log(event.point);
    cube.current.material.color.set(`hsl(${Math.random() * 360}, 100%, 75%)`);
  };

  useFrame((state, delta) => {
    cube.current.rotation.y += delta * 0.2;
  });

  return (
    <>
      <OrbitControls makeDefault />

      <directionalLight position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1.5} />

      <mesh position-x={-2} onClick={(event) => event.stopPropagation()}>
        <sphereGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>

      <mesh
        ref={cube}
        raycast={meshBounds}
        position-x={2}
        scale={1.5}
        onClick={eventHandler}
        onPointerEnter={(event) => (document.body.style.cursor = "pointer")}
        onPointerLeave={(event) => (document.body.style.cursor = "default")}
      >
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" />
      </mesh>

      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>
      <primitive
        object={model.scene}
        position-y={0.5}
        position-x={0}
        scale={0.25}
        onClick={(event) => {
          console.log(event.object.name);
          event.stopPropagation();
        }}
        onPointerEnter={(event) => (document.body.style.cursor = "pointer")}
        onPointerLeave={(event) => (document.body.style.cursor = "default")}
      />
    </>
  );
}

