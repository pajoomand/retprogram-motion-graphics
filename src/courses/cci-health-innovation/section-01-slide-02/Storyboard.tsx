import { loadFont } from "@remotion/google-fonts/Inter";
import { useCurrentFrame } from "remotion";
import { ContributionStory, contributionStates } from "./scenes/ContributionStory";
import manifest from "./storyboard.config.json";

loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "600", "700"],
});

export const slide02Poses = contributionStates;

export const Slide02Storyboard = () => {
  const frame = useCurrentFrame();
  if (manifest.beats.length !== slide02Poses.length) {
    throw new Error("Slide 2 storyboard poses must match the authored narrative beats.");
  }
  const state = slide02Poses[Math.floor(frame / manifest.framesPerBeat)];
  if (!state) throw new Error(`No Slide 2 storyboard state at inspection frame ${frame}.`);
  return <ContributionStory state={state} consumerFirstOpening />;
};
