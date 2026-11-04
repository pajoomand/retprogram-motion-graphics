import { loadFont } from "@remotion/google-fonts/Inter";
import { Audio } from "@remotion/media";
import { staticFile, useCurrentFrame } from "remotion";
import { ContributionStory } from "./scenes/ContributionStory";
import { getSlide02Timing, type Slide02Props, type Slide02Timing } from "./timing";

loadFont("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const NarrationLedDiagram = ({ timing }: { timing: Slide02Timing }) => {
  const frame = useCurrentFrame();
  const index = timing.scenes.findIndex((scene) => frame >= scene.from && frame < scene.end);
  const scene = timing.scenes[index];
  if (!scene) throw new Error(`Slide 2 has no visual state at frame ${frame}.`);
  return <ContributionStory state={scene.pose} motion={{ frame, timing }} consumerFirstOpening />;
};

export const CciSlide02 = (props: Slide02Props) => {
  const timing = getSlide02Timing(props);
  return (
    <>
      <Audio src={staticFile(props.narrationSrc)} />
      <NarrationLedDiagram timing={timing} />
    </>
  );
};
