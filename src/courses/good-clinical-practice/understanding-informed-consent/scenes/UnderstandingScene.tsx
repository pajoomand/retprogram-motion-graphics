import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Connector } from "../../../../shared/components/Connector";
import { SceneHeading } from "../components/SceneHeading";
import type { InformedConsentProofProps } from "../props";

const ease = Easing.bezier(0.16, 1, 0.3, 1);

export const UnderstandingScene: React.FC<{
  theme: InformedConsentProofProps["theme"];
}> = ({ theme }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <SceneHeading
        eyebrow="GOOD CLINICAL PRACTICE · INFORMED CONSENT"
        title="Understanding begins before joining"
        theme={theme}
      />
      <div
        style={{
          backgroundColor: theme.colors.surface,
          border: `1px solid ${theme.colors.rule}`,
          borderRadius: 12,
          boxShadow: "0 22px 60px rgba(24, 49, 61, 0.07)",
          height: 310,
          left: 310,
          opacity: interpolate(frame, [0, 28], [0.7, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          padding: "42px 44px",
          position: "absolute",
          top: 320,
          translate: `0px ${interpolate(frame, [8, 28], [18, 0], {
            easing: ease,
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}px`,
          width: 430,
        }}
      >
        <div
          style={{
            color: theme.colors.ink,
            fontFamily: theme.fontFamily,
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: "0.08em",
          }}
        >
          CLINICAL TRIAL
        </div>
        {[0, 1, 2, 3].map((line) => (
          <div
            key={line}
            style={{
              backgroundColor: theme.colors.rule,
              height: 8,
              marginTop: line === 0 ? 34 : 22,
              opacity: 0.9,
              scale: `${interpolate(frame, [22 + line * 5, 40 + line * 5], [0, 1], {
                easing: ease,
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })} 1`,
              transformOrigin: "left",
              width: line === 3 ? 205 : 330,
            }}
          />
        ))}
        <div
          style={{
            border: `2px solid ${theme.colors.ochre}`,
            borderRadius: "50%",
            height: 46,
            marginTop: 32,
            opacity: interpolate(frame, [48, 62], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            width: 46,
          }}
        />
      </div>
      <Connector
        path="M 800 565 C 920 565, 940 565, 1055 565"
        progress={interpolate(frame, [48, 84], [0, 1], {
          easing: ease,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}
        color={theme.colors.teal}
        strokeWidth={3}
      />
      <div
        style={{
          alignItems: "center",
          backgroundColor: theme.colors.surface,
          border: `1px solid ${theme.colors.rule}`,
          borderRadius: "50%",
          display: "flex",
          height: 154,
          justifyContent: "center",
          left: 1110,
          opacity: interpolate(frame, [66, 88], [0, 1], {
            easing: ease,
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          position: "absolute",
          top: 488,
          width: 154,
        }}
      >
        <svg
          width="76"
          height="76"
          viewBox="0 0 76 76"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="38" cy="38" r="29" stroke={theme.colors.teal} strokeWidth="2.5" />
          <path
            d="M25 39.5 34 48l18-21"
            stroke={theme.colors.teal}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div
        style={{
          color: theme.colors.ink,
          fontFamily: theme.fontFamily,
          fontSize: 28,
          fontWeight: 500,
          left: 1010,
          opacity: interpolate(frame, [76, 96], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          position: "absolute",
          textAlign: "center",
          top: 690,
          width: 354,
        }}
      >
        Understanding
      </div>
      <div
        style={{
          color: theme.colors.ink,
          fontFamily: theme.fontFamily,
          fontSize: 23,
          left: 1350,
          lineHeight: 1.45,
          opacity: interpolate(frame, [86, 108], [0, 0.72], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          position: "absolute",
          top: 536,
          width: 290,
        }}
      >
        More than a form.
        <br />
        A choice to understand.
      </div>
    </AbsoluteFill>
  );
};

