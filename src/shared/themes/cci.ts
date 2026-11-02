export const cciTheme = {
  paper: "#FAF8F3",
  ink: "#142D4E",
  muted: "#526375",
  teal: "#2D706A",
  rule: "#DADFD9",
  surface: "#FFFEFB",
  blue: "#E5EEF5",
  blueInk: "#496D8C",
  peach: "#FAE8DB",
  peachInk: "#975E43",
  lilac: "#ECE7F5",
  lilacInk: "#76608E",
  mint: "#E3EFE9",
  fontFamily: "Inter, Arial, sans-serif",
  safeX: 96,
} as const;

export type CciTheme = typeof cciTheme;

export const cciContentLayout = {
  eyebrowTop: 72,
  titleTop: 126,
  detailTop: 231,
  summaryDetailTop: 212,
  diagramOffsetY: -32,
  diagramScale: 1.08,
} as const;
