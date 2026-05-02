import {
  PresentationControls,
  useGLTF,
  Environment,
  Float,
  ContactShadows,
  Html,
  Text,
} from "@react-three/drei";

export default function Experience() {
  const computer = useGLTF("/macbook_pro/scene.gltf");
  return (
    <>
      <Environment preset="city" />
      <color args={["#241a1a"]} attach="background" />
      <PresentationControls
        global
        rotation={[0.13, 0.1, 0]}
        polar={[-0.4, 0.2]}
        azimuth={[-1, 0.75]}
        config={{ mass: 2, tension: 400 }}
      // snap={{ mass: 4, tension: 400 }}
      >
        <Float rotationIntensity={0.4}>
          <rectAreaLight
            width={2.5}
            height={1.65}
            intensity={65}
            color="#0c34eb"
            position={[0.1, 0.56, -1.4]}
            rotation={[0.1, Math.PI, 0]}
          />
          <primitive
            object={computer.scene}
            scale={0.08}
            position={[0.3, -0.6, 0]}
          >
            <Html transform wrapperClass="htmlScreen"
              distanceFactor={13.87}
              position={[0, 11.66, -17.4]}
              rotation={[-0.35, 0, 0]}
            >
              <iframe src="https://threejs-demo-ten-ecru.vercel.app/" />
            </Html>
          </primitive>
          <Text
            font="/bangers-v20-latin-regular.woff"
            fontSize={1}
            position={[1.5, 0.75, 0.75]}
            rotation-y={-1.25}
            maxWidth={2}
            textAlign="center"
            children="Nash Niu"
          />
        </Float>
      </PresentationControls>
      <ContactShadows position-y={-1.4} opacity={0.4} blur={2.4} scale={5} />
    </>
  );
}
