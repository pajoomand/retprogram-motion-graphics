import { interpolate, useCurrentFrame } from "remotion";
import { reveal } from "./motion";

export const ConnectorLine = ({
  path,
  color,
  from,
  convergeFrom,
  focusFrom,
  repeatFrom,
}: {
  readonly path: string;
  readonly color: string;
  readonly from: number;
  readonly convergeFrom: number;
  readonly focusFrom?: number;
  readonly repeatFrom?: number;
}) => {
  const frame = useCurrentFrame();
  const draw = reveal(frame, from + 12, 38);
  const flowFrom =
    repeatFrom !== undefined && frame >= repeatFrom ? repeatFrom : convergeFrom;
  const flow = interpolate(frame, [flowFrom, flowFrom + 62], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const focus = focusFrom === undefined ? 0 : reveal(frame, focusFrom, 30);
  return (
    <g fill="none" stroke={color} strokeLinecap="round">
      <path
        d={path}
        pathLength={1}
        strokeWidth={2 + focus}
        strokeDasharray="1"
        strokeDashoffset={1 - draw}
        opacity={0.55 + focus * 0.3}
      />
      <path
        d={path}
        pathLength={1}
        strokeWidth={6}
        strokeDasharray="0.012 0.988"
        strokeDashoffset={-flow}
        opacity={
          frame >= flowFrom && flow < 0.98 ? Math.sin(flow * Math.PI) : 0
        }
      />
    </g>
  );
};
