import {
  OrbitControls,
  Text3D,
  Center,
  useMatcapTexture,
} from "@react-three/drei";
import { Perf } from "r3f-perf";
import { useControls } from "leva";
import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

const material = new THREE.MeshMatcapMaterial();
const torusGeometry = new THREE.TorusGeometry(1, 0.6, 16, 32);
export default function Experience() {
  const { size } = useControls("text style", {
    size: {
      value: 0.75,
      max: 10,
      min: 0.1,
    },
  });
  // const [torusGeometry, setTorusGeometry] = useState();
  // const [material, setMaterial] = useState();
  const [matcapTexture] = useMatcapTexture("045C5C_0DBDBD_049393_04A4A4", 256);
  const donutGroupRef = useRef();
  const donutsRef = useRef([]);
  useFrame((state, delta) => {
    // for (let donut of donutGroupRef.current.children) {
    //   donut.rotation.y += delta * 0.1;
    // }
    donutsRef.current.forEach((donut) => {
      donut.rotation.y += delta * 0.1;
    });
  });
  useEffect(() => {
    matcapTexture.encoding = THREE.sRGBEncoding;
    material.matcap = matcapTexture;
    material.needsUpdate = true;
  }, []);
  return (
    <>
      <Perf position="top-left" />

      <OrbitControls makeDefault />
      {/* <torusGeometry ref={setTorusGeometry} args={[1, 0.6, 16, 32]} />
      <meshMatcapMaterial ref={setMaterial} matcap={matcapTexture} /> */}

      <Center>
        <Text3D
          material={material}
          font="/fonts/helvetiker_regular.typeface.json"
          size={size}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
        >
          hello r3f
        </Text3D>
      </Center>
      {/* <group ref={donutGroupRef}>
        {[...Array(100)].map((_, i) => (
          <mesh
            geometry={torusGeometry}
            material={material}
            key={i}
            position={[
              Math.random() * 10 - 5,
              Math.random() * 10 - 5,
              Math.random() * 10 - 5,
            ]}
            scale={0.2 + Math.random() * 0.2}
            rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
          />
        ))}
      </group> */}
      {[...Array(100)].map((_, i) => (
        <mesh
          ref={(el) => (donutsRef.current[i] = el)}
          geometry={torusGeometry}
          material={material}
          key={i}
          position={[
            Math.random() * 10 - 5,
            Math.random() * 10 - 5,
            Math.random() * 10 - 5,
          ]}
          scale={0.2 + Math.random() * 0.2}
          rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
        />
      ))}
    </>
  );
}
