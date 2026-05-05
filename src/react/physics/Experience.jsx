import { OrbitControls } from "@react-three/drei";
import { Perf } from "r3f-perf";
import {
  Physics,
  RigidBody,
  CuboidCollider,
  CylinderCollider,
  InstancedRigidBodies,
} from "@react-three/rapier";
import { useRef, useState, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";

export default function Experience() {
  //   const [hitSound] = useState(() => new Audio("/sounds/hit.mp3"));
  const hamburger = useGLTF("/models/hamburger.glb");
  const cubeRef = useRef(null);
  const twister = useRef(null);
  const cubeJump = () => {
    const mass = cubeRef.current.mass();
    cubeRef.current.applyImpulse({ x: 0, y: 5 * mass, z: 0 });
    cubeRef.current.applyTorqueImpulse({
      x: Math.random() - 0.5,
      y: Math.random() - 0.5,
      z: Math.random() - 0.5,
    });
  };
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const eulerRotation = new THREE.Euler(0, time * 3, 0);
    const quaternionRotation = new THREE.Quaternion();
    quaternionRotation.setFromEuler(eulerRotation);
    twister.current.setNextKinematicRotation(quaternionRotation);
    const angle = time * 0.5;
    const x = Math.cos(angle) * 2;
    const z = Math.sin(angle) * 2;
    twister.current.setNextKinematicTranslation({ x, y: -0.8, z });
  });
  const collisionEnter = () => {
    // hitSound.currentTime = 0;
    // hitSound.volume = Math.random();
    // hitSound.play();
  };
  const cubesRef = useRef();
  const cubesCount = 1000;
  const instances = useMemo(() => {
    const instances = [];
    for (let i = 0; i < cubesCount; i++) {
      instances.push({
        key: "instance_" + Math.random(),
        position: [Math.random() * 8 - 4, 6 + i * 0.2, Math.random() * 8 - 4],
        rotation: [Math.random(), Math.random(), Math.random()],
        scale: [
          0.2 + Math.random() * 0.8,
          0.2 + Math.random() * 0.8,
          0.2 + Math.random() * 0.8,
        ],
      });
    }
    return instances;
  }, []);
  // useEffect(() => {
  //   for (let i = 0; i < cubesCount; i++) {
  //     const matrix = new THREE.Matrix4();
  //     matrix.compose(
  //       new THREE.Vector3(i * 2, 0, 0),
  //       new THREE.Quaternion(),
  //       new THREE.Vector3(1, 1, 1),
  //     );
  //     cubesRef.current.setMatrixAt(i, matrix);
  //   }
  // }, []);

  return (
    <>
      <Perf position="top-left" />

      <OrbitControls makeDefault />

      <directionalLight castShadow position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1.5} />
      <Physics gravity={[0, -9.81, 0]}>
        <RigidBody colliders="ball" gravityScale={1}>
          <mesh castShadow position={[-1.5, 2, 0]}>
            <sphereGeometry />
            <meshStandardMaterial color="orange" />
          </mesh>
        </RigidBody>
        <RigidBody
          onCollisionEnter={collisionEnter}
          onCollisionExit={() => {
            console.log("collisionExit");
          }}
          onSleep={() => {
            console.log("onSleep");
          }}
          onWake={() => {
            console.log("onWake");
          }}
          ref={cubeRef}
          position={[1.5, 2, 0]}
          debug
          restitution={0}
          friction={0.7}
          colliders={false}
        >
          <CuboidCollider args={[0.5, 0.5, 0.5]} mass={1} />
          <mesh castShadow onClick={cubeJump}>
            <boxGeometry />
            <meshStandardMaterial color="mediumpurple" />
          </mesh>
        </RigidBody>
        <RigidBody position={[0, 4, 0]} colliders={false}>
          <CylinderCollider args={[0.5, 1.25]} />
          <primitive object={hamburger.scene} scale={0.25} />
        </RigidBody>
        {/* <RigidBody colliders={false}>
          <CuboidCollider args={[1, 1, 1]} />
          <mesh
            castShadow
            position={[0, 1, 0]}
            rotation={[Math.PI * 0.5, 0, 0]}
          >
            <torusGeometry args={[1, 0.5, 16, 32]} />
            <meshStandardMaterial color="mediumpurple" />
          </mesh>
        </RigidBody> */}
        <RigidBody
          position={[0, -0.8, 0]}
          friction={0}
          type="kinematicPosition"
          ref={twister}
          debug
        >
          <mesh castShadow scale={[0.4, 0.4, 3]}>
            <boxGeometry />
            <meshStandardMaterial color="red" />
          </mesh>
        </RigidBody>

        <RigidBody type="fixed" friction={0.7}>
          <mesh receiveShadow position-y={-1.25}>
            <boxGeometry args={[10, 0.5, 10]} />
            <meshStandardMaterial color="greenyellow" />
          </mesh>
        </RigidBody>
        {/* wall */}
        <RigidBody type="fixed">
          <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, 5.5]} />
          <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, -5.5]} />
          <CuboidCollider args={[0.5, 2, 5]} position={[5.5, 1, 0]} />
          <CuboidCollider args={[0.5, 2, 5]} position={[-5.5, 1, 0]} />
        </RigidBody>
        <InstancedRigidBodies
          colliders="cuboid"
          instances={instances}
        >
          <instancedMesh
            ref={cubesRef}
            castShadow
            args={[null, null, cubesCount]}
            count={cubesCount}
          >
            <boxGeometry />
            <meshStandardMaterial color="tomato" />
          </instancedMesh>
        </InstancedRigidBodies>
      </Physics>
    </>
  );
}
