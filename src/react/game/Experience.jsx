import Lights from "./Lights.jsx";
import Level, { BlockAxe, BlockLimbo, BlockSpinner } from "./level.jsx";
import { Physics } from "@react-three/rapier";
import Player from "./player.jsx";
import useGame from "./stores/useGame.js";
export default function Experience() {
  const blocksCount = useGame((state) => state.blocksCount);
  return (
    <>
      <Physics debug>
        <Lights />
        <Level
          count={blocksCount}
          types={[BlockSpinner, BlockLimbo, BlockAxe]}
        />
        <Player />
      </Physics>
    </>
  );
}
