import { Audio } from "@remotion/media";
import { loadFont } from "@remotion/google-fonts/Inter";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { CourseHeader } from "../../../shared/components/cci/CourseHeader";
import { cciTheme } from "../../../shared/themes/cci";
import { slide01Content } from "./content";
import { getSlide01Timing, type Slide01Props } from "./timing";
import { NarrativeHeading } from "./scenes/NarrativeHeading";
import { PerspectiveNetwork } from "./scenes/PerspectiveNetwork";
import { NarrationCaptions } from "./scenes/NarrationCaptions";

loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "600", "700"],
});

export const CciSlide01 = (props: Slide01Props) => {
  const timing = getSlide01Timing(props);
  return (
    <AbsoluteFill
      style={{
        background: cciTheme.paper,
        color: cciTheme.ink,
        fontFamily: cciTheme.fontFamily,
        overflow: "hidden",
      }}
    >
      <Sequence
        name="Slide 1 - narration-led continuous diagram"
        durationInFrames={timing.durationInFrames}
      >
        <Audio src={staticFile(props.narrationSrc)} />
        <CourseHeader
          course={slide01Content.course}
          section={slide01Content.section}
        />
        <NarrativeHeading timing={timing} />
        <PerspectiveNetwork timing={timing} />
        {props.showCaptions ? (
          <div data-cci-captions>
            <NarrationCaptions />
          </div>
        ) : null}
      </Sequence>
    </AbsoluteFill>
  );
};
