import { useKeyboardControls } from "@react-three/drei";
import useGame from "./stores/useGame";
import { useRef, useEffect } from "react";
import { addEffect } from "@react-three/fiber";
export default function Interface() {
  const timeRef = useRef(0);
  const forward = useKeyboardControls((state) => state.forward);
  const backward = useKeyboardControls((state) => state.backward);
  const leftward = useKeyboardControls((state) => state.leftward);
  const rightward = useKeyboardControls((state) => state.rightward);
  const jump = useKeyboardControls((state) => state.jump);
  const reset = useGame((state) => state.reStart);
  const phase = useGame((state) => state.phase);
  useEffect(() => {
    const unsubscribe = addEffect(() => {
      const state = useGame.getState();
      let elapsedTime = 0;
      if (state.phase === 'playing') {
        elapsedTime = (Date.now() - state.startTime) / 1000;
      } else if (state.phase === 'ended') {
        elapsedTime = (state.endTime - state.startTime) / 1000;
      }
      if (timeRef.current) {
        timeRef.current.textContent = elapsedTime.toFixed(2);
      }
    });
    return () => { unsubscribe() };
  }, []);
  return (
    <div className="interface">
      <div className="time" ref={timeRef}>0.0</div>
      {phase === "ended" && (
        <div className="restart" onClick={reset}>Restart</div>
      )}
      {/* controls */}
      <div className="controls">
        <div className="raw">
          <div className={`key ${forward ? "active" : ""}`}></div>
        </div>
        <div className="raw">
          <div className={`key ${leftward ? "active" : ""}`}></div>
          <div className={`key ${backward ? "active" : ""}`}></div>
          <div className={`key ${rightward ? "active" : ""}`}></div>
        </div>
        <div className="raw">
          <div className={`key ${jump ? "active" : ""} large`}></div>
        </div>
      </div>
    </div>
  );
}

