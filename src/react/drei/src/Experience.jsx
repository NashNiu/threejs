import { MeshReflectorMaterial, Float, Text, Html as HtmlDrei, OrbitControls, TransformControls, PivotControls } from '@react-three/drei'
import { useRef } from 'react'

export default function Experience() {
    const cubeRef = useRef(null)
    const sphereRef = useRef(null)
    return <>

        <OrbitControls makeDefault />

        <directionalLight position={[1, 2, 3]} intensity={4.5} />
        <ambientLight intensity={1.5} />

        <PivotControls
            anchor={[0, 0, 0]}
            depthTest={false}
            lineWidth={10}
            axisColors={['#abcdef', 'red', 'green']}
            scale={2}
        // fixed={true}
        >

            <mesh ref={sphereRef} position-x={- 2}>
                <sphereGeometry />
                <meshStandardMaterial color="orange" />
                <HtmlDrei
                    position={[1, 1, 0]}
                    wrapperClass='label'
                    center={true}
                    distanceFactor={6}
                    occlude={[sphereRef, cubeRef]}
                >
                    this is a sphere
                </HtmlDrei>
            </mesh>
        </PivotControls>
        <mesh ref={cubeRef} position-x={2} scale={1.5}>
            <boxGeometry />
            <meshStandardMaterial color="mediumpurple" />
        </mesh>
        <TransformControls object={cubeRef} />

        <mesh position-y={- 1} rotation-x={- Math.PI * 0.5} scale={10}>
            <planeGeometry />
            {/* <meshStandardMaterial color="greenyellow" /> */}
            <MeshReflectorMaterial
                resolution={512}
                blur={[1000,1000]}
                mixBlur={0}
                mirror={0.75}
                color="greenyellow" />
        </mesh>
        <Float
            speed={5}
            floatIntensity={2}
        >
            <Text
                font='../public/bangers-v20-latin-regular.woff'
                color="red"
                position={[0, 1, 0]}
                maxWidth={2}
                textAlign="center"
            >
                this is a plane
                <meshNormalMaterial />
            </Text>
        </Float>
    </>
}