import { z } from "zod";
import { defaultRetProgramTheme, retProgramThemeSchema } from "../../../shared/themes/retprogram";

export const retProgramPropsSchema = z.object({
  title: z.string().default("RETProgram"),
  descriptor: z.string().default("Research Education and Training Program"),
  sceneDurations: z
    .object({
      opening: z.number().int().positive().default(90),
      formation: z.number().int().positive().default(120),
      network: z.number().int().positive().default(240),
      closing: z.number().int().positive().default(90),
    })
    .default({
      opening: 90,
      formation: 120,
      network: 240,
      closing: 90,
    }),
  theme: retProgramThemeSchema.default(defaultRetProgramTheme),
  narrationSrc: z.string().default(""),
});

export type RetProgramProps = z.infer<typeof retProgramPropsSchema>;

export const defaultRetProgramProps = retProgramPropsSchema.parse({});

export const getRetProgramDuration = (props: RetProgramProps) =>
  Object.values(props.sceneDurations).reduce(
    (total, duration) => total + duration,
    0,
  );
