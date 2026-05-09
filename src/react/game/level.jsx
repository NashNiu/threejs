import * as THREE from "three";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Text, useGLTF } from "@react-three/drei";

THREE.ColorManagement.legacyMode = false;

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const floor1Material = new THREE.MeshStandardMaterial({ color: "limegreen" });
const floor2Material = new THREE.MeshStandardMaterial({ color: "greenyellow" });
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: "orangered" });
const wallMaterial = new THREE.MeshStandardMaterial({ color: "slategrey" });

export function BlockStart({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      <Float floatIntensity={0.25} rotationIntensity={0.25}>
        <Text
          maxWidth={0.25}
          lineHeight={0.75}
          textAlign="right"
          position={[0.75, 0.65, 0]}
          rotateY={-0.25}
          scale={0.5} font="/fonts/bebas-neue-v9-latin-regular.woff"> Marble Race
          <meshBasicMaterial toneMapped={false} />
        </Text>
      </Float>
      <mesh
        geometry={boxGeometry}
        material={floor1Material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
    </group>
  );
}
export function BlockEnd({ position = [0, 0, 0] }) {
  const model = useGLTF("/models/hamburger.glb");
  model.scene.children.forEach((mesh) => {
    mesh.castShadow = true;
  });
  return (
    <group position={position}>
      <Text
        position={[0, 2.25, 2]}
        font="/fonts/bebas-neue-v9-latin-regular.woff" scale={0.5}>
        <meshBasicMaterial toneMapped={false} />
        FINISH
      </Text>
      <mesh
        geometry={boxGeometry}
        material={floor1Material}
        position={[0, 0, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
      <RigidBody
        type="fixed"
        colliders="hull"
        restitution={0.2}
        friction={0}
        position={[0, 0.25, 0]}
      >
        <primitive object={model.scene} scale={0.2} />
      </RigidBody>
    </group>
  );
}

export function BlockSpinner({ position = [0, 0, 0] }) {
  const obstacle = useRef();
  const [speed] = useState(
    () => (Math.random() + 0.2) * (Math.random() < 0.5 ? -1 : 1),
  );
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const rotation = new THREE.Quaternion();
    rotation.setFromEuler(new THREE.Euler(0, time * speed, 0));
    obstacle.current.setNextKinematicRotation(rotation);
  });
  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        material={floor2Material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
      <RigidBody
        ref={obstacle}
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        friction={0}
        restitution={0.2}
      >
        <mesh
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[3.5, 0.3, 0.3]}
          castShadow
          receiveShadow
        />
      </RigidBody>
    </group>
  );
}

export function BlockLimbo({ position = [0, 0, 0] }) {
  const obstacle = useRef();
  const [timeOffset] = useState(() => (Math.random() + 0.2) * (Math.PI * 2));
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const y = Math.sin(time + timeOffset) + 1.15;
    obstacle.current.setNextKinematicTranslation({
      x: position[0],
      y: position[1] + y,
      z: position[2],
    });
  });
  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        material={floor2Material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
      <RigidBody
        ref={obstacle}
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        friction={0}
        restitution={0.2}
      >
        <mesh
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[3.5, 0.3, 0.3]}
          castShadow
          receiveShadow
        />
      </RigidBody>
    </group>
  );
}

export function BlockAxe({ position = [0, 0, 0] }) {
  const obstacle = useRef();
  const [timeOffset] = useState(() => (Math.random() + 0.2) * (Math.PI * 2));
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const x = Math.sin(time + timeOffset) * 1.25;
    obstacle.current.setNextKinematicTranslation({
      x: position[0] + x,
      y: position[1] + 0.75,
      z: position[2],
    });
  });
  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        material={floor2Material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
      <RigidBody
        ref={obstacle}
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        friction={0}
        restitution={0.2}
      >
        <mesh
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[1.5, 1.5, 0.3]}
          castShadow
          receiveShadow
        />
      </RigidBody>
    </group>
  );
}
function Bounds({ length = 1 }) {
  return (
    <>
      <RigidBody type="fixed" restitution={0.2} friction={0}>
        <mesh
          geometry={boxGeometry}
          material={wallMaterial}
          position={[2.15, 0.75, -2 * (length - 1)]}
          scale={[0.3, 1.5, 4 * length]}
          castShadow
        />
        <mesh
          geometry={boxGeometry}
          material={wallMaterial}
          position={[-2.15, 0.75, -2 * (length - 1)]}
          scale={[0.3, 1.5, 4 * length]}
          receiveShadow
        />
        <mesh
          geometry={boxGeometry}
          material={wallMaterial}
          position={[0, 0.75, -4 * length + 2]}
          scale={[4, 1.5, 0.3]}
          receiveShadow
        />
        <CuboidCollider
          restitution={0.2}
          friction={1}
          position={[0, -0.1, -2 * length + 2]}
          args={[2, 0.1, 2 * length]}
        />
      </RigidBody>
    </>
  );
}
export default function Level({
  count = 15,
  types = [BlockSpinner, BlockLimbo, BlockAxe],
  seed = 0,
}) {
  const blocks = useMemo(() => {
    const blocks = []
    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      blocks.push(type);
    }
    return blocks;
  }, [count, types, seed]);
  return (
    <>
      <BlockStart position={[0, 0, 0]} />
      {/* {Array.from({ length: count }, (_, i) => {
        const Component = types[Math.floor(Math.random() * types.length)];
        return <Component key={i} position={[0, 0, -(i + 1) * 4]} />;
      })} */}
      {blocks.map((Component, i) => {
        return <Component key={i} position={[0, 0, -(i + 1) * 4]} />;
      })}
      <BlockEnd position={[0, 0, -(count + 1) * 4]} />
      <Bounds length={count + 2} />
    </>
  );
}

