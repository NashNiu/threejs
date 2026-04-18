import "./style.css";
import ReactDOM from "react-dom/client";
import App from "./app";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

const root = ReactDOM.createRoot(document.querySelector("#root"));

root.render(
  <Canvas
    gl={{
      dpr: [1, 2],
       antialias: true,
       toneMapping: THREE.ACESFilmicToneMapping,
       outputEncoding: THREE.sRGBEncoding,
    }}
    // shadowMap={{ type: THREE.PCFShadowMap }}
    // shadowMap={{ type: THREE.PCFSoftShadowMap }}
    // flat={true}
    // orthographic
    camera={{
      fov: 45,
    //   zoom: 100,
      near: 0.1,
      far: 200,
      position: [3, 2, 6],
    }}
  >
    <App />
  </Canvas>,
);

