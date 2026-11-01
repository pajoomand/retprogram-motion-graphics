import type { CSSProperties, ReactNode } from "react";
import { useCurrentFrame } from "remotion";
import { textMotion, textReveal } from "./motion";

export const AnimatedHeading = ({
  children,
  from,
  duration = textMotion.duration,
  motionId,
  style,
}: {
  readonly children: ReactNode;
  readonly from: number;
  readonly duration?: number;
  readonly motionId?: string;
  readonly style?: CSSProperties;
}) => {
  const frame = useCurrentFrame();
  const progress = textReveal(frame, from, duration);
  return (
    <div
      data-cci-text={motionId}
      data-text-from={from}
      data-text-duration={duration}
      style={style}
    >
      <div
        data-cci-text-content
        style={{
          opacity: progress,
          translate: `0px ${textMotion.rise * (1 - progress)}px`,
        }}
      >
        {children}
      </div>
    </div>
  );
};
