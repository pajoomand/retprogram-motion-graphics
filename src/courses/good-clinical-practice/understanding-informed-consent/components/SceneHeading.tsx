import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Label } from "../../../../shared/components/Label";
import type { InformedConsentProofProps } from "../props";

const ease = Easing.bezier(0.16, 1, 0.3, 1);

export const SceneHeading: React.FC<{
  eyebrow: string;
  title: string;
  theme: InformedConsentProofProps["theme"];
}> = ({ eyebrow, title, theme }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        left: 220,
        opacity: interpolate(frame, [0, 16], [0.75, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        position: "absolute",
        top: 120,
        translate: `0px ${interpolate(frame, [0, 20], [12, 0], {
          easing: ease,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}px`,
      }}
    >
      <Label
        text={eyebrow}
        theme={theme}
        color={theme.colors.teal}
        style={{ fontSize: 20 }}
      />
      <h1
        style={{
          color: theme.colors.ink,
          fontFamily: theme.fontFamily,
          fontSize: 62,
          fontWeight: 500,
          letterSpacing: "-0.045em",
          lineHeight: 1.1,
          margin: "16px 0 0",
        }}
      >
        {title}
      </h1>
    </div>
  );
};

