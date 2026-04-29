import DrunkEffect from "./drunkEffect";
import { forwardRef } from "react";

export default forwardRef(function Drunk(props, ref) {
  const drunkEffect = new DrunkEffect(props);
  return <primitive ref={ref} object={drunkEffect} />;
});

