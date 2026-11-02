import {
  informedConsentConfig,
  informedConsentProofConfig,
} from "./courses/good-clinical-practice/understanding-informed-consent/video.config";
import { styleProofConfig } from "./courses/retprogram-brand/style-proof/video.config";
import { myCompConfig } from "./courses/examples/my-comp/video.config";
import { nextLogoConfig } from "./courses/examples/next-logo/video.config";
import { Composition, Folder } from "remotion";
import { CciSlide01 } from "./courses/cci-health-innovation/section-01-slide-01/Video";
import { slide01Config } from "./courses/cci-health-innovation/section-01-slide-01/video.config";
import { CciSlide02 } from "./courses/cci-health-innovation/section-01-slide-02/Video";
import { getSlide02Timing, slide02PropsSchema } from "./courses/cci-health-innovation/section-01-slide-02/timing";
import { Slide02Storyboard } from "./courses/cci-health-innovation/section-01-slide-02/Storyboard";
import { slide02Config } from "./courses/cci-health-innovation/section-01-slide-02/video.config";
import slide02Storyboard from "./courses/cci-health-innovation/section-01-slide-02/storyboard.config.json";
import {
  getSlide01Timing,
  slide01PropsSchema,
} from "./courses/cci-health-innovation/section-01-slide-01/timing";
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
      <Folder name="cci-health-innovation">
        <Composition
          id="CCIHealthInnovation-S01-Slide01"
          component={CciSlide01}
          durationInFrames={slide01Config.durationInFrames}
          fps={slide01Config.fps}
          width={slide01Config.width}
          height={slide01Config.height}
          schema={slide01PropsSchema}
          defaultProps={{
            sceneDurations: {
              opening: 156,
              clinical: 125,
              innovation: 177,
              funder: 169,
              livedExperience: 193,
              convergence: 90,
              consumerInvolvement: 147,
              messageReveal: 66,
              finalHold: 57,
            },
            showCaptions: false,
            captionSrc:
              "courses/cci-health-innovation/section-01-slide-01/closed-captions.json",
            narrationSrc:
              "courses/cci-health-innovation/section-01-slide-01/s01-slide01-temp-narration.mp3",
          }}
          calculateMetadata={({ props }) => ({
            durationInFrames: getSlide01Timing(props).durationInFrames,
          })}
        />
        <Composition
          id="CCIHealthInnovation-S01-Slide02"
          component={CciSlide02}
          durationInFrames={slide02Config.durationInFrames}
          fps={slide02Config.fps}
          width={slide02Config.width}
          height={slide02Config.height}
          schema={slide02PropsSchema}
          defaultProps={{
            sceneDurations: {
              definition: 410, separate: 236, invited: 111, need: 68, assumption: 46,
              options: 35, decision: 62, expertise: 438, voices: 370,
            },
            narrationSrc: "courses/cci-health-innovation/section-01-slide-02/s01-slide02-temp-narration.mp3",
            captionSrc: "courses/cci-health-innovation/section-01-slide-02/closed-captions.json",
            showCaptions: false,
          }}
          calculateMetadata={({ props }) => ({
            durationInFrames: getSlide02Timing(props).durationInFrames,
          })}
        />
        <Composition
          id="CCIHealthInnovation-S01-Slide02-Storyboard"
          component={Slide02Storyboard}
          durationInFrames={slide02Storyboard.beats.length * slide02Storyboard.framesPerBeat}
          fps={slide02Config.fps}
          width={slide02Config.width}
          height={slide02Config.height}
        />
      </Folder>
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
