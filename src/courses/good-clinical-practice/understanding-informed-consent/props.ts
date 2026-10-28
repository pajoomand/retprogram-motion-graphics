import { z } from "zod";
import { defaultRetProgramTheme, retProgramThemeSchema } from "../../../shared/themes/retprogram";

export const informedConsentPropsSchema = z.object({
  sceneDurations: z
    .object({
      understanding: z.number().int().positive().default(180),
      communication: z.number().int().positive().default(270),
      voluntaryChoice: z.number().int().positive().default(270),
      conclusion: z.number().int().positive().default(180),
    })
    .default({
      understanding: 180,
      communication: 270,
      voluntaryChoice: 270,
      conclusion: 180,
    }),
  theme: retProgramThemeSchema.default(defaultRetProgramTheme),
  narrationSrc: z.string().default(""),
});

export type InformedConsentProps = z.infer<
  typeof informedConsentPropsSchema
>;

export const getInformedConsentDuration = (
  props: InformedConsentProps,
) =>
  Object.values(props.sceneDurations).reduce(
    (total, duration) => total + duration,
    0,
  );

export const informedConsentProofPropsSchema = z.object({
  sceneDurations: z
    .object({
      understanding: z.number().int().positive().default(180),
      communication: z.number().int().positive().default(360),
    })
    .default({ understanding: 180, communication: 360 }),
  theme: retProgramThemeSchema.default(defaultRetProgramTheme),
  narrationSrc: z.string().default(""),
});

export type InformedConsentProofProps = z.infer<
  typeof informedConsentProofPropsSchema
>;

export const getInformedConsentProofDuration = (
  props: InformedConsentProofProps,
) =>
  Object.values(props.sceneDurations).reduce(
    (total, duration) => total + duration,
    0,
  );
