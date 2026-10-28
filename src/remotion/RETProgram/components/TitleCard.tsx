import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { RetProgramTheme } from "../theme";
import { Icon } from "./Icon";

export const TitleCard: React.FC<{
  title: string;
  descriptor: string;
  theme: RetProgramTheme;
  compact?: boolean;
}> = ({ title, descriptor, theme, compact = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        gap: compact ? 28 : 42,
        justifyContent: "center",
        position: "absolute",
        inset: 0,
        translate: `0px ${interpolate(frame, [0, 18], [16, 0], {
          easing: Easing.bezier(0.16, 1, 0.3, 1),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}px`,
        opacity: interpolate(frame, [0, 12], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      <div
        style={{
          alignItems: "center",
          backgroundColor: theme.colors.surface,
          border: `1px solid ${theme.colors.rule}`,
          borderRadius: "50%",
          display: "flex",
          height: compact ? 96 : 128,
          justifyContent: "center",
          width: compact ? 96 : 128,
        }}
      >
        <Icon
          name="research"
          color={theme.colors.teal}
          size={compact ? 50 : 68}
        />
      </div>
      <div style={{ minWidth: 0 }}>
        <h1
          style={{
            color: theme.colors.ink,
            fontFamily: theme.fontFamily,
            fontSize: compact ? 74 : 108,
            fontWeight: 600,
            letterSpacing: "-0.055em",
            lineHeight: 1,
            margin: 0,
          }}
        >
          {title}
        </h1>
        <p
          style={{
            color: theme.colors.ink,
            fontFamily: theme.fontFamily,
            fontSize: compact ? 22 : 28,
            fontWeight: 400,
            letterSpacing: "0.02em",
            lineHeight: 1.4,
            margin: "20px 0 0",
            opacity: 0.72,
          }}
        >
          {descriptor}
        </p>
        <div
          style={{
            backgroundColor: theme.colors.ochre,
            height: 3,
            marginTop: 28,
            transformOrigin: "left",
            scale: `${interpolate(frame, [10, fps * 0.9], [0, 1], {
              easing: Easing.bezier(0.16, 1, 0.3, 1),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })} 1`,
            width: 140,
          }}
        />
      </div>
    </div>
  );
};
