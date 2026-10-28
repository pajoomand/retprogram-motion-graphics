import { Audio } from "@remotion/media";
import { fontFamily as interFontFamily, loadFont } from "@remotion/google-fonts/Inter";
import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { BasicCaptions } from "../../../shared/captions/BasicCaptions";
import type { InformedConsentProofProps } from "./props";
import { UnderstandingScene } from "./scenes/UnderstandingScene";
import { ConversationScene } from "./scenes/ConversationScene";

loadFont("normal", { subsets: ["latin"], weights: ["400", "500", "600", "700"] });

const CAPTION_WIDTH = 1100;
const CAPTION_LEFT = (1920 - CAPTION_WIDTH) / 2;
const CAPTION_BOTTOM = 76;

export const InformedConsentProof: React.FC<InformedConsentProofProps> = (
  props,
) => {
  const theme = {
    ...props.theme,
    fontFamily: props.theme.fontFamily || interFontFamily,
  };
  const { understanding, communication } = props.sceneDurations;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.paper,
        backgroundImage: `radial-gradient(${theme.colors.rule} 1px, transparent 1px)`,
        backgroundSize: "34px 34px",
        color: theme.colors.ink,
        overflow: "hidden",
      }}
    >
      {props.narrationSrc ? (
        <Audio src={staticFile(props.narrationSrc)} />
      ) : null}
      <Sequence name="Understanding" durationInFrames={understanding}>
        <UnderstandingScene theme={theme} />
        <BasicCaptions
          name="Understanding captions (provisional)"
          captions={[
            {
              text: "Before joining a clinical trial, ",
              startMs: 0,
              endMs: 2200,
              timestampMs: 1100,
              confidence: null,
            },
            {
              text: "participants need to understand ",
              startMs: 2300,
              endMs: 4600,
              timestampMs: 3450,
              confidence: null,
            },
            {
              text: "what they're agreeing to.",
              startMs: 4700,
              endMs: 6000,
              timestampMs: 5350,
              confidence: null,
            },
          ]}
          combineTokensWithinMilliseconds={700}
          width={CAPTION_WIDTH}
          style={{
            bottom: CAPTION_BOTTOM,
            left: CAPTION_LEFT,
            position: "absolute",
          }}
        />
      </Sequence>
      <Sequence
        name="Communication"
        from={understanding}
        durationInFrames={communication}
      >
        <ConversationScene theme={theme} />
        <BasicCaptions
          name="Communication captions (provisional)"
          captions={[
            {
              text: "Informed consent is more than signing a form.",
              startMs: 0,
              endMs: 3000,
              timestampMs: 1500,
              confidence: null,
            },
            {
              text: " It's an ongoing conversation about the trial's",
              startMs: 3200,
              endMs: 8000,
              timestampMs: 5600,
              confidence: null,
            },
            {
              text: " purpose, procedures, potential risks, benefits and alternatives.",
              startMs: 8200,
              endMs: 12000,
              timestampMs: 10100,
              confidence: null,
            },
          ]}
          combineTokensWithinMilliseconds={700}
          width={CAPTION_WIDTH}
          style={{
            bottom: CAPTION_BOTTOM,
            left: CAPTION_LEFT,
            position: "absolute",
          }}
        />
      </Sequence>
    </AbsoluteFill>
  );
};

