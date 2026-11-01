import { useCurrentFrame } from "remotion";
import { cciTheme } from "../../themes/cci";
import { PerspectiveIcon, type PerspectiveIconName } from "./PerspectiveIcon";
import { reveal, textMotion } from "./motion";
import { AnimatedHeading } from "./AnimatedHeading";

export type Perspective = {
  readonly id: PerspectiveIconName;
  readonly title: string;
  readonly detail: string;
  readonly fill: string;
  readonly accent: string;
  readonly x: number;
  readonly y: number;
};

export const PerspectiveCard = ({
  perspective,
  from,
  focusFrom,
}: {
  readonly perspective: Perspective;
  readonly from: number;
  readonly focusFrom?: number;
}) => {
  const frame = useCurrentFrame();
  const arrival = reveal(frame, from, 32);
  const focus = focusFrom === undefined ? 0 : reveal(frame, focusFrom, 38);
  const { x, y, fill, accent, id, title, detail } = perspective;

  return (
    <div
      data-perspective={id}
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 510,
        height: 164,
      }}
    >
      <div
        data-perspective-surface
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 28,
          background: fill,
          border: `2px solid ${focus > 0 ? accent : "transparent"}`,
          boxSizing: "border-box",
          boxShadow: `0 ${4 + focus * 4}px ${16 + focus * 8}px rgba(20,45,78,${0.025 + focus * 0.025})`,
          opacity: arrival,
          translate: `${(x < 960 ? -18 : 18) * (1 - arrival)}px ${10 * (1 - arrival)}px`,
          scale: 0.98 + 0.02 * arrival + 0.012 * focus,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 24,
            top: 35,
            width: 82,
            height: 90,
            display: "grid",
            placeItems: "center",
            color: accent,
          }}
        >
          <PerspectiveIcon name={id} />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 132,
          right: 26,
          top: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <AnimatedHeading
          motionId={`${id}-title`}
          from={from + textMotion.stagger}
          style={{
            color: cciTheme.ink,
            fontSize: 29,
            fontWeight: 650,
            letterSpacing: -0.8,
            lineHeight: 1.2,
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </AnimatedHeading>
        <AnimatedHeading
          motionId={`${id}-detail`}
          from={from + 2 * textMotion.stagger}
          style={{
            color: cciTheme.muted,
            fontSize: 24,
            lineHeight: 1.4,
            marginTop: 12,
            whiteSpace: "nowrap",
          }}
        >
          {detail}
        </AnimatedHeading>
      </div>
    </div>
  );
};
