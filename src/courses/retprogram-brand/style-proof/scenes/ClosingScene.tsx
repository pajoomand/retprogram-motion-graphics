import React from "react";
import { BasicCaptions } from "../../../../shared/captions/BasicCaptions";
import { SceneTransition } from "../../../../shared/components/SceneTransition";
import { TitleCard } from "../../../../shared/components/TitleCard";
import type { RetProgramProps } from "../props";

const CAPTION_WIDTH = 1100;
const CAPTION_LEFT = (1920 - CAPTION_WIDTH) / 2;
const CAPTION_BOTTOM = 76;

export const ClosingScene: React.FC<{ props: RetProgramProps; theme: RetProgramProps["theme"] }> = ({ props, theme }) => (<>
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
        </>);
