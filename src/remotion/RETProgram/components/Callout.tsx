import React from "react";
import type { RetProgramTheme } from "../theme";
import { Label } from "./Label";

export const Callout: React.FC<{
  title: string;
  detail?: string;
  theme: RetProgramTheme;
  accent?: string;
  style?: React.CSSProperties;
}> = ({ title, detail, theme, accent = theme.colors.teal, style }) => {
  return (
    <div
      style={{
        alignItems: "stretch",
        borderTop: `2px solid ${accent}`,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        padding: "18px 0 0",
        ...style,
      }}
    >
      <Label text={title} theme={theme} color={theme.colors.ink} />
      {detail ? (
        <div
          style={{
            color: theme.colors.ink,
            fontFamily: theme.fontFamily,
            fontSize: 22,
            lineHeight: 1.35,
            opacity: 0.76,
          }}
        >
          {detail}
        </div>
      ) : null}
    </div>
  );
};
