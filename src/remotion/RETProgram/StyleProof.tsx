import { Audio } from "@remotion/media";
import {
  fontFamily as interFontFamily,
  loadFont,
} from "@remotion/google-fonts/Inter";
import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { BasicCaptions } from "./components/BasicCaptions";
import { Diagram } from "./components/Diagram";
import { SceneTransition } from "./components/SceneTransition";
import { TitleCard } from "./components/TitleCard";
import type { RetProgramProps } from "./props";

loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "600", "700"],
});

const CAPTION_WIDTH = 1100;
const CAPTION_LEFT = (1920 - CAPTION_WIDTH) / 2;
const CAPTION_BOTTOM = 76;

export const RetProgramStyleProof: React.FC<RetProgramProps> = (props) => {
  const { opening, formation, network, closing } = props.sceneDurations;
  const formationFrom = opening;
  const networkFrom = opening + formation;
  const closingFrom = opening + formation + network;
  const theme = {
    ...props.theme,
    fontFamily: props.theme.fontFamily || interFontFamily,
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.paper,
        color: theme.colors.ink,
        overflow: "hidden",
      }}
    >
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${theme.colors.rule} 1px, transparent 1px)`,
          backgroundSize: "34px 34px",
          opacity: 0.32,
        }}
      />
      {props.narrationSrc ? (
        <Audio src={staticFile(props.narrationSrc)} />
      ) : null}

      <Sequence name="Brand opening" durationInFrames={opening}>
        <SceneTransition>
          <TitleCard
            title={props.title}
            descriptor={props.descriptor}
            theme={theme}
          />
        </SceneTransition>
        <BasicCaptions
          name="Opening captions"
          captions={[]}
          width={CAPTION_WIDTH}
          style={{
            bottom: CAPTION_BOTTOM,
            left: CAPTION_LEFT,
            position: "absolute",
          }}
        />
      </Sequence>

      <Sequence
        name="System formation"
        from={formationFrom}
        durationInFrames={formation}
      >
        <SceneTransition>
          <Diagram theme={theme} showLabels={false} />
        </SceneTransition>
        <BasicCaptions
          name="Formation captions"
          captions={[]}
          width={CAPTION_WIDTH}
          style={{
            bottom: CAPTION_BOTTOM,
            left: CAPTION_LEFT,
            position: "absolute",
          }}
        />
      </Sequence>

      <Sequence
        name="Connected system"
        from={networkFrom}
        durationInFrames={network}
      >
        <SceneTransition>
          <Diagram theme={theme} showLabels />
        </SceneTransition>
        <BasicCaptions
          name="Network captions"
          captions={[]}
          width={CAPTION_WIDTH}
          style={{
            bottom: CAPTION_BOTTOM,
            left: CAPTION_LEFT,
            position: "absolute",
          }}
        />
      </Sequence>

      <Sequence
        name="Brand resolution"
        from={closingFrom}
        durationInFrames={closing}
      >
        <SceneTransition>
          <TitleCard
            title={props.title}
            descriptor={props.descriptor}
            theme={theme}
            compact
          />
        </SceneTransition>
        <BasicCaptions
          name="Closing captions"
          captions={[]}
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
