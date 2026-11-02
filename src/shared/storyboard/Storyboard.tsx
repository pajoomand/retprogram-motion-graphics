import type { ReactNode } from "react";
import { Freeze, Sequence } from "remotion";

export type StoryboardState = {
  name: string;
  visual: ReactNode;
  freezeFrame?: number;
};

export const Storyboard = ({
  states,
  framesPerBeat,
}: {
  states: readonly StoryboardState[];
  framesPerBeat: number;
}) => {
  if (!states.length || !Number.isInteger(framesPerBeat) || framesPerBeat < 1) {
    throw new Error("Storyboard needs visual states and a positive framesPerBeat.");
  }
  return (
    <>
      {states.map((state, index) => (
        <Sequence
          key={state.name}
          name={state.name}
          from={index * framesPerBeat}
          durationInFrames={framesPerBeat}
        >
          <Freeze frame={state.freezeFrame ?? 0}>{state.visual}</Freeze>
        </Sequence>
      ))}
    </>
  );
};
