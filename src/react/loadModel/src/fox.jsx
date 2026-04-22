import { useGLTF, useAnimations } from "@react-three/drei";
import { useEffect } from "react";
import { useControls } from "leva";
export default function Fox() {
  const fox = useGLTF("../public/Fox/gltf/fox.gltf");
  const { actions } = useAnimations(fox.animations, fox.scene);
  const { animationName } = useControls("fox", {
    animationName: {
      options: Object.keys(actions),
    },
  });
  useEffect(() => {
    // current animation fade in
    const animation = actions[animationName];
    if (actions) {
      animation.reset().fadeIn(0.5).play();
    }
    // setTimeout(() => {
    //   actions["Walk"].play();
    //   actions["Walk"].crossFadeFrom(actions["Run"], 1);
    // }, 2000);
    return () => {
      // previous animation fade out
      if (animation) {
        animation.fadeOut(0.5);
      }
    };
  }, [animationName]);
  return (
    <primitive object={fox.scene} scale={0.02} position={[-2.5, 0, 2.5]} />
  );
}

