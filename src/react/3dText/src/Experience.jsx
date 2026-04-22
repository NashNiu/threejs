import {
  OrbitControls,
  Text3D,
  Center,
  useMatcapTexture,
} from "@react-three/drei";
import { Perf } from "r3f-perf";
import { useControls } from "leva";

export default function Experience() {
  const { size } = useControls("text style", {
    size: {
      value: 0.75,
      max: 10,
      min: 0.1,
    },
  });
  const [matcapTexture] = useMatcapTexture("045C5C_0DBDBD_049393_04A4A4", 256);
  return (
    <>
      <Perf position="top-left" />

      <OrbitControls makeDefault />
      <Center>
        <Text3D
          font="../public/fonts/helvetiker_regular.typeface.json"
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
          <meshMatcapMaterial matcap={matcapTexture} />
        </Text3D>
      </Center>
      {[...Array(100)].map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.random() * 10 - 5,
            Math.random() * 10 - 5,
            Math.random() * 10 - 5,
          ]}
          scale={0.2 + Math.random() * 0.2}
          rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
        >
          <torusGeometry args={[1, 0.6, 16, 32]} />
          <meshMatcapMaterial matcap={matcapTexture} />
        </mesh>
      ))}
    </>
  );
}
