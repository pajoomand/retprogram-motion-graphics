import { cciTheme } from "../../themes/cci";
import { AnimatedHeading } from "./AnimatedHeading";
import { textMotion } from "./motion";

export const EndFrame = ({
  from,
  middle,
  outcome,
}: {
  readonly from: number;
  readonly middle: string;
  readonly outcome: string;
}) => {
  return (
    <div
      style={{
        position: "absolute",
        left: 96,
        top: 224,
      }}
    >
      <AnimatedHeading
        motionId="resolution-perspectives"
        from={from}
        style={{ fontSize: 33, fontWeight: 550, letterSpacing: 0.4 }}
      >
        {middle}
      </AnimatedHeading>
      <AnimatedHeading
        motionId="resolution-decisions"
        from={from + textMotion.resolutionStagger}
        style={{
          fontSize: 58,
          lineHeight: 1.15,
          fontWeight: 700,
          letterSpacing: -1.6,
          color: cciTheme.teal,
          marginTop: 12,
        }}
      >
        {outcome}
      </AnimatedHeading>
    </div>
  );
};
