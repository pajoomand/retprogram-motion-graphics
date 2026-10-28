import { z } from "zod";

const themeColorsSchema = z
  .object({
    paper: z.string().default("#F6F4EE"),
    ink: z.string().default("#18313D"),
    teal: z.string().default("#3E827B"),
    ochre: z.string().default("#C59A4A"),
    coral: z.string().default("#C97863"),
    rule: z.string().default("#D7D5CE"),
    surface: z.string().default("#FFFEFA"),
  })
  .default({
    paper: "#F6F4EE",
    ink: "#18313D",
    teal: "#3E827B",
    ochre: "#C59A4A",
    coral: "#C97863",
    rule: "#D7D5CE",
    surface: "#FFFEFA",
  });

export const retProgramThemeSchema = z.object({
  colors: themeColorsSchema,
  fontFamily: z.string().default("Inter, Arial, sans-serif"),
});

export type RetProgramTheme = z.infer<typeof retProgramThemeSchema>;

export const defaultRetProgramTheme = retProgramThemeSchema.parse({});
