import { Audio } from "@remotion/media";
import { fontFamily as interFontFamily, loadFont } from "@remotion/google-fonts/Inter";
import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { BasicCaptions } from "../../../shared/captions/BasicCaptions";
import type { InformedConsentProps } from "./props";
import { UnderstandingScene } from "./scenes/UnderstandingScene";
import { ConversationScene } from "./scenes/ConversationScene";
import { VoluntaryChoiceScene } from "./scenes/VoluntaryChoiceScene";
import { ConclusionScene } from "./scenes/ConclusionScene";

loadFont("normal", { subsets: ["latin"], weights: ["400", "500", "600", "700"] });

const CAPTION_WIDTH = 1100;
const CAPTION_LEFT = (1920 - CAPTION_WIDTH) / 2;
const CAPTION_BOTTOM = 76;

export const InformedConsentVideo: React.FC<InformedConsentProps> = (props) => {
  const theme = {
    ...props.theme,
    fontFamily: props.theme.fontFamily || interFontFamily,
  };
  const { understanding, communication, voluntaryChoice, conclusion } =
    props.sceneDurations;
  const communicationFrom = understanding;
  const voluntaryChoiceFrom = communicationFrom + communication;
  const conclusionFrom = voluntaryChoiceFrom + voluntaryChoice;

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
        from={communicationFrom}
        durationInFrames={communication}
      >
        <ConversationScene theme={theme} />
        <BasicCaptions
          name="Communication captions (provisional)"
          captions={[
            {
              text: "Informed consent is more than signing a form.",
              startMs: 0,
              endMs: 3200,
              timestampMs: 1600,
              confidence: null,
            },
            {
              text: " It's an ongoing conversation about the trial's purpose, procedures, potential risks, benefits and alternatives.",
              startMs: 3400,
              endMs: 9000,
              timestampMs: 6200,
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
        name="Voluntary choice"
        from={voluntaryChoiceFrom}
        durationInFrames={voluntaryChoice}
      >
        <VoluntaryChoiceScene theme={theme} />
        <BasicCaptions
          name="Voluntary choice captions (provisional)"
          captions={[
            {
              text: "Participation must be voluntary.",
              startMs: 0,
              endMs: 2200,
              timestampMs: 1100,
              confidence: null,
            },
            {
              text: " Participants can ask questions, take time to decide,",
              startMs: 2400,
              endMs: 5800,
              timestampMs: 4100,
              confidence: null,
            },
            {
              text: " and withdraw at any time without penalty.",
              startMs: 6100,
              endMs: 9000,
              timestampMs: 7550,
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
        name="Conclusion"
        from={conclusionFrom}
        durationInFrames={conclusion}
      >
        <ConclusionScene theme={theme} />
        <BasicCaptions
          name="Conclusion captions (provisional)"
          captions={[
            {
              text: "Ultimately, informed consent protects participants' rights and empowers them to make informed choices.",
              startMs: 0,
              endMs: 6000,
              timestampMs: 3000,
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
