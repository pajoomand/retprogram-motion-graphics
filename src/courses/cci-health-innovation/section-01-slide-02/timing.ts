import { z } from "zod";
import analysis from "./audio-analysis.json";
import { slide02Config } from "./video.config";

const frames = z.number().int().min(20).max(slide02Config.durationInFrames);
export const slide02PropsSchema = z.object({
  sceneDurations: z.object({
    definition: frames.default(412),
    separate: frames.default(227),
    invited: frames.default(98),
    need: frames.default(65),
    assumption: frames.default(47),
    options: frames.default(37),
    decision: frames.default(69),
    expertise: frames.default(413),
    voices: frames.default(352),
  }).refine(
    (durations) => Object.values(durations).reduce((total, value) => total + value, 0) === slide02Config.durationInFrames,
    `Scene durations must total ${slide02Config.durationInFrames} frames to preserve the measured narration length.`,
  ),
  narrationSrc: z.literal(slide02Config.narrationSrc),
  captionSrc: z.literal(slide02Config.captionSrc),
  showCaptions: z.literal(false),
});

export type Slide02Props = z.infer<typeof slide02PropsSchema>;
export type Slide02Pose = keyof Slide02Props["sceneDurations"];
export type Slide02SubCue = typeof analysis.subCues[number]["name"];

export const slide02PoseOrder: readonly Slide02Pose[] = [
  "definition", "separate", "invited", "need", "assumption",
  "options", "decision", "expertise", "voices",
];

export const getSlide02Timing = (props: Slide02Props) => {
  const parsed = slide02PropsSchema.parse(props);
  let cursor = 0;
  const scenes = slide02PoseOrder.map((pose) => {
    const from = cursor;
    cursor += parsed.sceneDurations[pose];
    return { pose, from, end: cursor };
  });
  const subCue = (name: Slide02SubCue) => {
    const cue = analysis.subCues.find((item) => item.name === name);
    if (!cue) throw new Error(`Missing measured Slide 2 sub-cue: ${name}`);
    const originalScene = [...analysis.cues].reverse().find((item) => item.frame <= cue.frame);
    const scene = scenes.find((item) => item.pose === originalScene?.pose);
    if (!scene || !originalScene) throw new Error(`Sub-cue ${name} has no scene.`);
    const frame = scene.from + cue.frame - originalScene.frame;
    if (frame >= scene.end) throw new Error(`Scene duration clips measured sub-cue: ${name}`);
    return frame;
  };
  return { scenes, subCue, durationInFrames: cursor };
};

export type Slide02Timing = ReturnType<typeof getSlide02Timing>;
