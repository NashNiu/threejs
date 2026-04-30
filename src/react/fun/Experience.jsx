import {
  PresentationControls,
  useGLTF,
  Environment,
  Float,
} from "@react-three/drei";

export default function Experience() {
  const computer = useGLTF("/macbook_pro/scene.gltf");
  return (
    <>
      <Environment preset="city" />
      <color args={["#241a1a"]} attach="background" />
      <PresentationControls makeDefault>
        <Float rotationIntensity={0.4}>
          <primitive
            object={computer.scene}
            scale={0.07}
            position={[0.3, -0.6, 0]}
          />
        </Float>
      </PresentationControls>
    </>
  );
}

