import { useCurrentFrame } from "remotion";
import { AnimatedHeading } from "../../../../shared/components/cci/AnimatedHeading";
import { EndFrame } from "../../../../shared/components/cci/EndFrame";
import {
  textMotion,
  textReveal,
} from "../../../../shared/components/cci/motion";
import { cciTheme } from "../../../../shared/themes/cci";
import { slide01Content as copy } from "../content";
import type { Slide01Timing } from "../timing";

export const NarrativeHeading = ({
  timing,
}: {
  readonly timing: Slide01Timing;
}) => {
  const frame = useCurrentFrame();
  const resolve = textReveal(
    frame,
    timing.endMessage - textMotion.duration,
    textMotion.duration,
  );
  return (
    <>
      <AnimatedHeading
        motionId="opening-eyebrow"
        from={8}
        style={{
          position: "absolute",
          left: 96,
          top: 166,
          fontSize: 23,
          fontWeight: 600,
          letterSpacing: 3,
          color: cciTheme.teal,
        }}
      >
        ONE PROBLEM
      </AnimatedHeading>
      <div style={{ opacity: 1 - resolve }}>
        <AnimatedHeading
          motionId="opening-title"
          from={8 + textMotion.stagger}
          style={{
            position: "absolute",
            left: 96,
            top: 219,
            fontSize: 74,
            fontWeight: 700,
            letterSpacing: -2.5,
            lineHeight: 1.15,
          }}
        >
          {copy.openingTitle}
        </AnimatedHeading>
        <AnimatedHeading
          motionId="opening-support"
          from={8 + 2 * textMotion.stagger}
          style={{
            position: "absolute",
            left: 100,
            top: 319,
            fontSize: 28,
            color: cciTheme.muted,
          }}
        >
          {copy.openingDetail}
        </AnimatedHeading>
      </div>
      <EndFrame
        from={timing.endMessage}
        middle={copy.finalMiddle}
        outcome={copy.finalOutcome}
      />
    </>
  );
};
