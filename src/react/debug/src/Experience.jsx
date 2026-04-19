import { OrbitControls } from '@react-three/drei'
import { useControls, button } from 'leva'
import { Perf } from 'r3f-perf'

export default function Experience() {
    const { perfVisible } = useControls('perf', {
        perfVisible: true
    })
    const { position, color } = useControls('sphere', {
        position: {
            value: { x: -2, y: 0 },
            step: 0.01,
            joystick: 'invertY'
        },
        color: 'orange',
        myInterval: {
            value: [3, 4],
            min: 1,
            max: 10
        },
        clickMe: button(() => {
            console.log('click me')
        }),
        chioice: {
            options: ['a', 'b', 'c']
        }
    })
    const { visible } = useControls('cube', {
        visible: true
    })

    return <>


        {perfVisible && (
            <Perf position={'top-left'} />
        )}
        <OrbitControls makeDefault />

        <directionalLight position={[1, 2, 3]} intensity={4.5} />
        <ambientLight intensity={1.5} />

        <mesh position={[position.x, position.y, 0]}>
            <sphereGeometry />
            <meshStandardMaterial color={color} />
        </mesh>

        <mesh position-x={2} scale={1.5} visible={visible}>
            <boxGeometry />
            <meshStandardMaterial color="mediumpurple" />
        </mesh>

        <mesh position-y={- 1} rotation-x={- Math.PI * 0.5} scale={10}>
            <planeGeometry />
            <meshStandardMaterial color="greenyellow" />
        </mesh>

    </>
}