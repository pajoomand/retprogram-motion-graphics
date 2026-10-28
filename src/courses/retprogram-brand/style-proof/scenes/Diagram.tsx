import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import type { RetProgramTheme } from "../../../../shared/themes/retprogram";
import { Callout } from "../../../../shared/components/Callout";
import { Connector } from "../../../../shared/components/Connector";
import { Icon, type IconName } from "../../../../shared/components/Icon";

const nodes: {
  title: string;
  icon: IconName;
  x: number;
  y: number;
  accent: "teal" | "ochre" | "coral";
}[] = [
  { title: "Research", icon: "research", x: 370, y: 510, accent: "teal" },
  { title: "Education", icon: "education", x: 960, y: 390, accent: "ochre" },
  { title: "Training", icon: "training", x: 1550, y: 510, accent: "coral" },
];

export const Diagram: React.FC<{
  theme: RetProgramTheme;
  showLabels: boolean;
}> = ({ theme, showLabels }) => {
  const frame = useCurrentFrame();

  const routeProgress = interpolate(frame, [0, 90], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
      }}
    >
      <Connector
        path="M 370 510 C 610 510, 670 390, 960 390 S 1310 510, 1550 510"
        progress={routeProgress}
        color={theme.colors.rule}
        strokeWidth={3}
      />
      {nodes.map((node, index) => {
        const delay = index * 24;
        const nodeProgress = interpolate(frame, [delay, delay + 18], [0, 1], {
          easing: Easing.bezier(0.16, 1, 0.3, 1),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const labelProgress = showLabels
          ? interpolate(frame, [16 + index * 14, 36 + index * 14], [0, 1], {
              easing: Easing.bezier(0.16, 1, 0.3, 1),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          : 0;
        const accentColor = theme.colors[node.accent];

        return (
          <div
            key={node.title}
            style={{
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
              left: node.x,
              opacity: nodeProgress,
              position: "absolute",
              top: node.y - 78,
              translate: "-50% 0px",
              scale: `${interpolate(nodeProgress, [0, 1], [0.86, 1], {
                easing: Easing.bezier(0.16, 1, 0.3, 1),
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })})`,
              width: 320,
            }}
          >
            <div
              style={{
                alignItems: "center",
                backgroundColor: theme.colors.surface,
                border: `1px solid ${theme.colors.rule}`,
                borderRadius: "50%",
                boxShadow: "0 16px 48px rgba(24, 49, 61, 0.06)",
                display: "flex",
                height: 156,
                justifyContent: "center",
                width: 156,
              }}
            >
              <Icon name={node.icon} color={accentColor} size={64} />
            </div>
            {showLabels ? (
              <div
                style={{
                  marginTop: 24,
                  opacity: labelProgress,
                  transform: `translateY(${interpolate(
                    labelProgress,
                    [0, 1],
                    [10, 0],
                    {
                      easing: Easing.bezier(0.16, 1, 0.3, 1),
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    },
                  )}px)`,
                  width: "100%",
                }}
              >
                <Callout
                  title={node.title}
                  theme={theme}
                  accent={accentColor}
                  style={{ textAlign: "center" }}
                />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};
