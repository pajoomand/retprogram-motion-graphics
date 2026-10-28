import React from "react";
import type { RetProgramTheme } from "../themes/retprogram";

export const Label: React.FC<{
  text: string;
  theme: RetProgramTheme;
  color?: string;
  style?: React.CSSProperties;
}> = ({ text, theme, color = theme.colors.ink, style }) => {
  return (
    <div
      style={{
        color,
        fontFamily: theme.fontFamily,
        fontSize: 24,
        fontWeight: 600,
        letterSpacing: "0.12em",
        lineHeight: 1.2,
        textTransform: "uppercase",
        ...style,
      }}
    >
      {text}
    </div>
  );
};
