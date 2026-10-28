import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";

export const SceneTransition: React.FC<{
  children: React.ReactNode;
  revealFrames?: number;
}> = ({ children, revealFrames = 20 }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        clipPath: `inset(0 ${interpolate(frame, [0, revealFrames], [100, 0], {
          easing: Easing.bezier(0.65, 0, 0.35, 1),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}% 0 0)`,
      }}
    >
      {children}
    </div>
  );
};
