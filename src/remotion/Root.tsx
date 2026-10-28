import { Composition } from "remotion";
import {
  COMP_NAME,
  defaultMyCompProps,
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "../../types/constants";
import { Main } from "./MyComp/Main";
import { NextLogo } from "./MyComp/NextLogo";
import { RetProgramStyleProof } from "./RETProgram/StyleProof";
import {
  getRetProgramDuration,
  retProgramPropsSchema,
} from "./RETProgram/props";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="RETProgramStyleProof"
        component={RetProgramStyleProof}
        durationInFrames={540}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: "RETProgram",
          descriptor: "Research Education and Training Program",
          sceneDurations: {
            opening: 90,
            formation: 120,
            network: 240,
            closing: 90,
          },
          theme: {
            colors: {
              paper: "#F6F4EE",
              ink: "#18313D",
              teal: "#3E827B",
              ochre: "#C59A4A",
              coral: "#C97863",
              rule: "#D7D5CE",
              surface: "#FFFEFA",
            },
            fontFamily: "Inter, Arial, sans-serif",
          },
          narrationSrc: "",
        }}
        schema={retProgramPropsSchema}
        calculateMetadata={({ props }) => ({
          durationInFrames: getRetProgramDuration(props),
        })}
      />
      <Composition
        id={COMP_NAME}
        component={Main}
        durationInFrames={DURATION_IN_FRAMES}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        defaultProps={defaultMyCompProps}
      />
      <Composition
        id="NextLogo"
        component={NextLogo}
        durationInFrames={300}
        fps={30}
        width={140}
        height={140}
        defaultProps={{
          outProgress: 0,
        }}
      />
    </>
  );
};
