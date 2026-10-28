import { Audio } from "@remotion/media";
import {
  fontFamily as interFontFamily,
  loadFont,
} from "@remotion/google-fonts/Inter";
import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import type { RetProgramProps } from "./props";
import { OpeningScene } from "./scenes/OpeningScene";
import { NetworkScene } from "./scenes/NetworkScene";
import { ClosingScene } from "./scenes/ClosingScene";

loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "600", "700"],
});


export const RetProgramStyleProof: React.FC<RetProgramProps> = (props) => {
  const { opening, formation, network, closing } = props.sceneDurations;
  const networkFrom = opening + formation;
  const closingFrom = opening + formation + network;
  const theme = {
    ...props.theme,
    fontFamily: props.theme.fontFamily || interFontFamily,
  };

  return (
    <>
      <AbsoluteFill
        style={{
          backgroundColor: theme.colors.paper,
          color: theme.colors.ink,
          overflow: "hidden",
        }}
        durationInFrames={420}
        trimBefore={120}
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

        <Sequence name="Brand opening" durationInFrames={opening} from={120}>
          <OpeningScene props={props} theme={theme} />
        </Sequence>

        <Sequence
          name="Connected system"
          from={networkFrom}
          durationInFrames={network}
        >
          <NetworkScene props={props} theme={theme} />
        </Sequence>

        <Sequence
          name="Brand resolution"
          from={closingFrom}
          durationInFrames={closing}
        >
          <ClosingScene props={props} theme={theme} />
        </Sequence>
      </AbsoluteFill>
    </>
  );
};
