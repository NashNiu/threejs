import { OrbitControls } from "@react-three/drei";
import Lights from "./Lights.jsx";
import Level, { BlockAxe, BlockLimbo, BlockSpinner } from "./level.jsx";
import { Physics } from "@react-three/rapier";
import Player from "./player.jsx";
export default function Experience() {
  return (
    <>
      <OrbitControls makeDefault />
      <Physics debug>
        <Lights />
        <Level count={3} types={[BlockSpinner, BlockLimbo, BlockAxe]} />
        <Player />
      </Physics>
    </>
  );
}
