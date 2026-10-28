import { informedConsentConfig, informedConsentProofConfig } from "./courses/good-clinical-practice/understanding-informed-consent/video.config";
import { styleProofConfig } from "./courses/retprogram-brand/style-proof/video.config";
import { myCompConfig } from "./courses/examples/my-comp/video.config";
import { nextLogoConfig } from "./courses/examples/next-logo/video.config";
import { Composition, Folder } from "remotion";
import { Main } from "./courses/examples/my-comp/Video";
import { NextLogo } from "./courses/examples/next-logo/Video";
import { RetProgramStyleProof } from "./courses/retprogram-brand/style-proof/Video";
import { InformedConsentVideo } from "./courses/good-clinical-practice/understanding-informed-consent/Video";
import { InformedConsentProof } from "./courses/good-clinical-practice/understanding-informed-consent/Proof";
import {
  getRetProgramDuration,
  retProgramPropsSchema,
} from "./courses/retprogram-brand/style-proof/props";
import {
  getInformedConsentDuration,
  getInformedConsentProofDuration,
  informedConsentPropsSchema,
  informedConsentProofPropsSchema,
} from "./courses/good-clinical-practice/understanding-informed-consent/props";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="retprogram-brand">
      <Composition
        id="RETProgramStyleProof"
        component={RetProgramStyleProof}
        durationInFrames={styleProofConfig.durationInFrames}
        fps={styleProofConfig.fps}
        width={styleProofConfig.width}
        height={styleProofConfig.height}
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
      </Folder>
      <Folder name="good-clinical-practice">
      <Composition
        id="RETProgramInformedConsentProof"
        component={InformedConsentProof}
        durationInFrames={informedConsentProofConfig.durationInFrames}
        fps={informedConsentProofConfig.fps}
        width={informedConsentProofConfig.width}
        height={informedConsentProofConfig.height}
        defaultProps={{
          sceneDurations: {
            understanding: 180,
            communication: 360,
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
        schema={informedConsentProofPropsSchema}
        calculateMetadata={({ props }) => ({
          durationInFrames: getInformedConsentProofDuration(props),
        })}
      />
      <Composition
        id="RETProgramInformedConsent"
        component={InformedConsentVideo}
        durationInFrames={informedConsentConfig.durationInFrames}
        fps={informedConsentConfig.fps}
        width={informedConsentConfig.width}
        height={informedConsentConfig.height}
        defaultProps={{
          sceneDurations: {
            understanding: 180,
            communication: 270,
            voluntaryChoice: 270,
            conclusion: 180,
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
        schema={informedConsentPropsSchema}
        calculateMetadata={({ props }) => ({
          durationInFrames: getInformedConsentDuration(props),
        })}
      />
      </Folder>
      <Folder name="examples">
      <Composition
        id="MyComp"
        component={Main}
        durationInFrames={myCompConfig.durationInFrames}
        fps={myCompConfig.fps}
        width={myCompConfig.width}
        height={myCompConfig.height}
        defaultProps={{ title: "RETProgram" }}
      />
      <Composition
        id="NextLogo"
        component={NextLogo}
        durationInFrames={nextLogoConfig.durationInFrames}
        fps={nextLogoConfig.fps}
        width={nextLogoConfig.width}
        height={nextLogoConfig.height}
        defaultProps={{
          outProgress: 0,
        }}
      />
      </Folder>
    </>
  );
};
