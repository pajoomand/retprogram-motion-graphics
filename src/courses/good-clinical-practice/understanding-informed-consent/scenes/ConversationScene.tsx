import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Connector } from "../../../../shared/components/Connector";
import { SceneHeading } from "../components/SceneHeading";
import type { InformedConsentProofProps } from "../props";

const ease = Easing.bezier(0.16, 1, 0.3, 1);

export const ConversationScene: React.FC<{
  theme: InformedConsentProofProps["theme"];
}> = ({ theme }) => {
  const frame = useCurrentFrame();
  const topics = [
    { title: "Purpose", x: 284, accent: theme.colors.teal },
    { title: "Procedures", x: 550, accent: theme.colors.ochre },
    { title: "Potential risks", x: 816, accent: theme.colors.coral },
    { title: "Benefits", x: 1082, accent: theme.colors.teal },
    { title: "Alternatives", x: 1348, accent: theme.colors.ochre },
  ];

  return (
    <AbsoluteFill>
      <SceneHeading
        eyebrow="AN ONGOING CONVERSATION"
        title="More than signing a form"
        theme={theme}
      />
      <Connector
        path="M 590 490 C 730 390, 870 390, 960 470 C 1050 390, 1190 390, 1330 490"
        progress={interpolate(frame, [14, 62], [0, 1], {
          easing: ease,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}
        color={theme.colors.rule}
        strokeWidth={3}
      />
      {[
        { x: 590, accent: theme.colors.teal },
        { x: 1330, accent: theme.colors.ochre },
      ].map((person, index) => {
        const delay = 4 + index * 12;
        const progress = interpolate(frame, [delay, delay + 24], [0.7, 1], {
          easing: ease,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <svg
            key={person.x}
            aria-hidden="true"
            width="180"
            height="220"
            viewBox="0 0 180 220"
            style={{
              left: person.x - 90,
              opacity: progress,
              position: "absolute",
              top: 366,
              scale: `${interpolate(progress, [0, 1], [0.92, 1], {
                easing: ease,
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })}`,
            }}
          >
            <circle
              cx="90"
              cy="58"
              r="34"
              fill={theme.colors.paper}
              stroke={person.accent}
              strokeWidth="3"
            />
            <path
              d="M27 196c4-48 24-76 63-76s59 28 63 76"
              fill={theme.colors.surface}
              stroke={person.accent}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      })}
      <div
        style={{
          alignItems: "center",
          backgroundColor: theme.colors.surface,
          border: `1px solid ${theme.colors.rule}`,
          borderRadius: 999,
          color: theme.colors.ink,
          display: "flex",
          fontFamily: theme.fontFamily,
          fontSize: 23,
          height: 76,
          justifyContent: "center",
          left: 805,
          opacity: interpolate(frame, [42, 64], [0, 1], {
            easing: ease,
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          position: "absolute",
          top: 438,
          width: 310,
        }}
      >
        Ongoing conversation
      </div>
      <Connector
        path="M 960 515 C 960 605, 960 622, 960 675"
        progress={interpolate(frame, [68, 96], [0, 1], {
          easing: ease,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}
        color={theme.colors.rule}
        strokeWidth={2}
      />
      {topics.map((topic, index) => {
        const progress = interpolate(frame, [86 + index * 8, 106 + index * 8], [0, 1], {
          easing: ease,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={topic.title}
            style={{
              backgroundColor: theme.colors.surface,
              border: `1px solid ${theme.colors.rule}`,
              borderRadius: 4,
              borderTop: `3px solid ${topic.accent}`,
              color: theme.colors.ink,
              fontFamily: theme.fontFamily,
              fontSize: 22,
              fontWeight: 500,
              left: topic.x,
              opacity: progress,
              padding: "22px 18px",
              position: "absolute",
              textAlign: "center",
              top: 690,
              translate: `0px ${interpolate(progress, [0, 1], [10, 0], {
                easing: ease,
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })}px`,
              width: 238,
            }}
          >
            {topic.title}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

