import { OrbitControls } from "@react-three/drei";
import Lights from "./Lights.jsx";
import Level, { BlockAxe, BlockLimbo, BlockSpinner } from "./level.jsx";
import { Physics } from "@react-three/rapier";
export default function Experience() {
  return (
    <>
      <OrbitControls makeDefault />
      <Physics debug>
        <Lights />
        <Level count={10} types={[BlockSpinner, BlockLimbo, BlockAxe]} />
      </Physics>
    </>
  );
}

