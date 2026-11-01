import { Easing, interpolate } from "remotion";

export const textMotion = {
  duration: 14,
  rise: 10,
  stagger: 5,
  resolutionStagger: 6,
} as const;

export const textReveal = (frame: number, from: number, duration: number) =>
  interpolate(frame, [from, from + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 0.61, 0.36, 1),
  });

export const reveal = (frame: number, from: number, duration = 30) =>
  interpolate(frame, [from, from + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
