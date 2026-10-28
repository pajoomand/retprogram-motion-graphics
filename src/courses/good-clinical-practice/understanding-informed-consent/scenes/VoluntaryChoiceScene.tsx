import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Connector } from "../../../../shared/components/Connector";
import { SceneHeading } from "../components/SceneHeading";
import type { InformedConsentProps } from "../props";

const ease = Easing.bezier(0.16, 1, 0.3, 1);

export const VoluntaryChoiceScene: React.FC<{
  theme: InformedConsentProps["theme"];
}> = ({ theme }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <SceneHeading
        eyebrow="VOLUNTARY PARTICIPATION"
        title="Participation is voluntary"
        theme={theme}
      />
      <svg
        aria-hidden="true"
        width="128"
        height="156"
        viewBox="0 0 128 156"
        style={{
          left: 342,
          opacity: interpolate(frame, [0, 20], [0.7, 1], {
            easing: ease,
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          position: "absolute",
          top: 420,
        }}
      >
        <circle
          cx="64"
          cy="42"
          r="31"
          fill={theme.colors.paper}
          stroke={theme.colors.teal}
          strokeWidth="3"
        />
        <path
          d="M17 150c3-37 18-61 47-61s44 24 47 61"
          fill={theme.colors.surface}
          stroke={theme.colors.teal}
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <div
        style={{
          backgroundColor: theme.colors.surface,
          border: `2px solid ${theme.colors.teal}`,
          borderRadius: "50%",
          height: 22,
          left: 488,
          opacity: interpolate(frame, [4, 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          position: "absolute",
          top: 486,
          width: 22,
        }}
      />
      <Connector
        path="M 510 500 C 660 500, 700 420, 890 420"
        progress={interpolate(frame, [10, 42], [0, 1], {
          easing: ease,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}
        color={theme.colors.teal}
        strokeWidth={3}
      />
      <Connector
        path="M 510 500 C 660 500, 700 620, 890 620"
        progress={interpolate(frame, [10, 42], [0, 1], {
          easing: ease,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}
        color={theme.colors.ochre}
        strokeWidth={3}
      />
      <Connector
        path="M 890 420 C 1080 420, 1170 420, 1390 420"
        progress={interpolate(frame, [34, 72], [0, 1], {
          easing: ease,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}
        color={theme.colors.teal}
        strokeWidth={3}
      />
      <Connector
        path="M 1180 420 C 1290 420, 1290 554, 1390 554"
        progress={interpolate(frame, [60, 98], [0, 1], {
          easing: ease,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}
        color={theme.colors.coral}
        strokeWidth={2}
      />
      {[
        {
          title: "Participate",
          x: 790,
          y: 380,
          accent: theme.colors.teal,
          delay: 32,
        },
        {
          title: "Decline",
          x: 790,
          y: 580,
          accent: theme.colors.ochre,
          delay: 44,
        },
        {
          title: "Withdraw at any time",
          x: 1320,
          y: 514,
          accent: theme.colors.coral,
          delay: 86,
        },
      ].map((choice) => (
        <div
          key={choice.title}
          style={{
            backgroundColor: theme.colors.surface,
            border: `1px solid ${theme.colors.rule}`,
            borderLeft: `4px solid ${choice.accent}`,
            color: theme.colors.ink,
            fontFamily: theme.fontFamily,
            fontSize: 24,
            fontWeight: 500,
            left: choice.x,
            opacity: interpolate(
              frame,
              [choice.delay, choice.delay + 18],
              [0, 1],
              {
                easing: ease,
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            ),
            padding: "20px 24px",
            position: "absolute",
            top: choice.y,
            width: 280,
          }}
        >
          {choice.title}
        </div>
      ))}
      {[
        { title: "Ask questions", x: 500, color: theme.colors.teal },
        { title: "Take time to decide", x: 790, color: theme.colors.ochre },
        { title: "Without penalty", x: 1320, color: theme.colors.coral },
      ].map((callout, index) => {
        const progress = interpolate(
          frame,
          [104 + index * 10, 122 + index * 10],
          [0, 1],
          {
            easing: ease,
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        );

        return (
          <div
            key={callout.title}
            style={{
              borderTop: `2px solid ${callout.color}`,
              color: theme.colors.ink,
              fontFamily: theme.fontFamily,
              fontSize: 20,
              left: callout.x,
              opacity: progress,
              paddingTop: 12,
              position: "absolute",
              textAlign: "center",
              top: 700,
              width: 250,
            }}
          >
            {callout.title}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

