import { cciTheme } from "../../../shared/themes/cci";
import type { Perspective } from "../../../shared/components/cci/PerspectiveCard";

export const slide01Content = {
  course: "CCI in Health Innovation",
  section: "01 / Different perspectives",
  openingTitle: "One health problem.",
  openingDetail: "Different forms of knowledge and expertise.",
  centralLabel: "Innovation\ndecision",
  finalMiddle: "DIFFERENT PERSPECTIVES",
  finalOutcome: "BETTER-INFORMED DECISIONS",
} as const;

export const perspectives = {
  clinical: {
    id: "clinical",
    title: "Clinical perspective",
    detail: "Treatment + outcomes",
    fill: cciTheme.blue,
    accent: cciTheme.blueInk,
    x: 96,
    y: 430,
  },
  innovation: {
    id: "innovation",
    title: "Innovation perspective",
    detail: "Feasibility + value",
    fill: cciTheme.peach,
    accent: cciTheme.peachInk,
    x: 1314,
    y: 430,
  },
  funder: {
    id: "funding",
    title: "Funder / purchaser",
    detail: "Cost + impact",
    fill: cciTheme.lilac,
    accent: cciTheme.lilacInk,
    x: 96,
    y: 680,
  },
  livedExperience: {
    id: "experience",
    title: "Lived experience",
    detail: "Daily life + real needs",
    fill: cciTheme.mint,
    accent: cciTheme.teal,
    x: 1314,
    y: 680,
  },
} as const satisfies Record<string, Perspective>;
