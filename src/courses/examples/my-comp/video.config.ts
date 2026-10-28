import {
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "../../../../types/constants";

export const myCompConfig = {
  id: "MyComp",
  fps: VIDEO_FPS,
  width: VIDEO_WIDTH,
  height: VIDEO_HEIGHT,
  durationInFrames: DURATION_IN_FRAMES,
  mediaBasePath: "courses/examples/my-comp",
} as const;
