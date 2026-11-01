import { useCurrentFrame } from "remotion";
import { cciTheme } from "../../../../shared/themes/cci";
import { reveal } from "../../../../shared/components/cci/motion";
import type { Slide01Timing } from "../timing";
import { slide01Content } from "../content";
import { AnimatedHeading } from "../../../../shared/components/cci/AnimatedHeading";

export const DecisionNode = ({
  timing,
}: {
  readonly timing: Slide01Timing;
}) => {
  const frame = useCurrentFrame();
  const enter = reveal(frame, 8, 44);
  const integrated = reveal(frame, timing.convergence, 65);
  const arrivals = [
    { from: timing.clinical, color: cciTheme.blueInk },
    { from: timing.innovation, color: cciTheme.peachInk },
    { from: timing.funder, color: cciTheme.lilacInk },
    { from: timing.livedExperience, color: cciTheme.teal },
  ];
  return (
    <div
      style={{
        position: "absolute",
        left: 820,
        top: 490,
        width: 280,
        height: 240,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: enter,
          scale: 0.94 + enter * 0.06,
          translate: `0px ${12 * (1 - enter)}px`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: -35 - integrated * 8,
            border: `1px solid ${cciTheme.rule}`,
            borderRadius: 76,
            opacity: 0.7,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 40,
            background: cciTheme.surface,
            border: `1.5px solid ${cciTheme.rule}`,
            boxShadow: "0 14px 40px rgba(20,45,78,0.055)",
          }}
        >
          <svg
            width="66"
            height="66"
            viewBox="0 0 66 66"
            fill="none"
            aria-hidden="true"
            style={{ position: "absolute", left: 107, top: 43 }}
          >
            <rect
              x="8"
              y="8"
              width="50"
              height="50"
              rx="17"
              fill={cciTheme.mint}
            />
            <path
              d="M24 33h18M33 24v18"
              stroke={cciTheme.teal}
              strokeWidth="2"
              strokeLinecap="round"
            />
            {arrivals.map(({ from, color }, index) => (
              <circle
                key={from}
                cx={index % 2 === 0 ? 8 : 58}
                cy={index < 2 ? 8 : 58}
                r={3.5 + integrated}
                fill={color}
                opacity={reveal(frame, from + 38, 22)}
              />
            ))}
          </svg>
        </div>
      </div>
      <AnimatedHeading
        motionId="decision-label"
        from={18}
        style={{
          position: "absolute",
          left: 0,
          top: 125,
          width: 280,
          whiteSpace: "pre-line",
          textAlign: "center",
          fontSize: 30,
          fontWeight: 600,
          lineHeight: 1.2,
          letterSpacing: -0.6,
        }}
      >
        {slide01Content.centralLabel}
      </AnimatedHeading>
    </div>
  );
};
