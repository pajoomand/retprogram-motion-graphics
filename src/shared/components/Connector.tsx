import React from "react";

export const Connector: React.FC<{
  path: string;
  progress: number;
  color: string;
  strokeWidth?: number;
}> = ({ path, progress, color, strokeWidth = 2 }) => {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1920 1080"
      preserveAspectRatio="none"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        overflow: "visible",
      }}
    >
      <path
        d={path}
        fill="none"
        pathLength={1}
        stroke={color}
        strokeDasharray={1}
        strokeDashoffset={1 - Math.max(0, Math.min(1, progress))}
        strokeLinecap="round"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};
