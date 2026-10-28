import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Connector } from "../../../../shared/components/Connector";
import { SceneHeading } from "../components/SceneHeading";
import type { InformedConsentProps } from "../props";

const ease = Easing.bezier(0.16, 1, 0.3, 1);

export const ConclusionScene: React.FC<{
  theme: InformedConsentProps["theme"];
}> = ({ theme }) => {
  const frame = useCurrentFrame();
  const concepts = [
    { title: "Understanding", x: 480, accent: theme.colors.teal },
    { title: "Rights", x: 960, accent: theme.colors.ochre },
    { title: "Choice", x: 1440, accent: theme.colors.coral },
  ];

  return (
    <AbsoluteFill>
      <SceneHeading
        eyebrow="INFORMED CONSENT"
        title="Rights and informed choices"
        theme={theme}
      />
      <Connector
        path="M 260 390 C 500 390, 710 430, 960 505"
        progress={interpolate(frame, [0, 42], [0, 1], {
          easing: ease,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}
        color={theme.colors.teal}
        strokeWidth={3}
      />
      <Connector
        path="M 1660 390 C 1420 390, 1210 430, 960 505"
        progress={interpolate(frame, [0, 42], [0, 1], {
          easing: ease,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}
        color={theme.colors.coral}
        strokeWidth={3}
      />
      <Connector
        path="M 480 530 C 680 530, 760 530, 960 530 S 1240 530, 1440 530"
        progress={interpolate(frame, [0, 56], [0, 1], {
          easing: ease,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}
        color={theme.colors.rule}
        strokeWidth={3}
      />
      {concepts.map((concept, index) => {
        const progress = interpolate(
          frame,
          [20 + index * 12, 42 + index * 12],
          [0, 1],
          {
            easing: ease,
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        );

        return (
          <div
            key={concept.title}
            style={{
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
              left: concept.x,
              opacity: progress,
              position: "absolute",
              top: 430,
              translate: "-50% 0px",
              width: 300,
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
                height: 150,
                justifyContent: "center",
                width: 150,
              }}
            >
              <svg
                aria-hidden="true"
                width="72"
                height="72"
                viewBox="0 0 72 72"
                fill="none"
              >
                {index === 0 ? (
                  <>
                    <path
                      d="M14 18c8-3 15-2 22 3v34c-7-5-14-6-22-3V18Zm44 0c-8-3-15-2-22 3v34c7-5 14-6 22-3V18Z"
                      stroke={concept.accent}
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M22 28h8m-8 7h8m12-7h8m-8 7h8"
                      stroke={concept.accent}
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </>
                ) : null}
                {index === 1 ? (
                  <path
                    d="m36 10 21 8v15c0 14-9 23-21 29-12-6-21-15-21-29V18l21-8Z"
                    stroke={concept.accent}
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                ) : null}
                {index === 2 ? (
                  <>
                    <path
                      d="M14 36h17m0 0c13 0 12-17 26-17m-26 17c13 0 12 17 26 17"
                      stroke={concept.accent}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <circle cx="14" cy="36" r="4" fill={concept.accent} />
                    <circle cx="57" cy="19" r="4" fill={concept.accent} />
                    <circle cx="57" cy="53" r="4" fill={concept.accent} />
                  </>
                ) : null}
              </svg>
            </div>
            <div
              style={{
                color: theme.colors.ink,
                fontFamily: theme.fontFamily,
                fontSize: 26,
                fontWeight: 500,
                marginTop: 26,
                textAlign: "center",
              }}
            >
              {concept.title}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

