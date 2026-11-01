import { z } from "zod";
import { slide01Config } from "./video.config";

const frames = z.number().int().positive();
export const slide01PropsSchema = z
  .object({
    sceneDurations: z.object({
      opening: frames,
      clinical: frames,
      innovation: frames,
      funder: frames,
      livedExperience: frames,
      convergence: frames,
      consumerInvolvement: frames,
      messageReveal: frames.min(66),
      finalHold: frames.min(30),
    }),
    showCaptions: z.boolean(),
    narrationSrc: z.literal(slide01Config.narrationSrc),
    captionSrc: z.literal(slide01Config.captionSrc),
  })
  .refine(
    (props) =>
      Object.values(props.sceneDurations).reduce((sum, n) => sum + n, 0) ===
      slide01Config.durationInFrames,
    "Scene durations must total 1180 frames to preserve the measured narration length.",
  );

export type Slide01Props = z.infer<typeof slide01PropsSchema>;

export const getSlide01Timing = (props: Slide01Props) => {
  const validated = slide01PropsSchema.parse(props);
  const d = validated.sceneDurations;
  const clinical = d.opening;
  const innovation = clinical + d.clinical;
  const funder = innovation + d.innovation;
  const livedExperience = funder + d.funder;
  const convergence = livedExperience + d.livedExperience;
  const resolution = convergence + d.convergence;
  return {
    clinical,
    innovation,
    funder,
    livedExperience,
    convergence,
    resolution,
    endMessage: resolution + d.consumerInvolvement,
    durationInFrames:
      resolution + d.consumerInvolvement + d.messageReveal + d.finalHold,
  };
};

export type Slide01Timing = ReturnType<typeof getSlide01Timing>;
