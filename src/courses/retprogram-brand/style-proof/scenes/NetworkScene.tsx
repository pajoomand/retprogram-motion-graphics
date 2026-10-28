import React from "react";
import { BasicCaptions } from "../../../../shared/captions/BasicCaptions";
import { SceneTransition } from "../../../../shared/components/SceneTransition";
import { Diagram } from "./Diagram";
import type { RetProgramProps } from "../props";

const CAPTION_WIDTH = 1100;
const CAPTION_LEFT = (1920 - CAPTION_WIDTH) / 2;
const CAPTION_BOTTOM = 76;

export const NetworkScene: React.FC<{ props: RetProgramProps; theme: RetProgramProps["theme"] }> = ({ theme }) => (<>
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
        </>);
