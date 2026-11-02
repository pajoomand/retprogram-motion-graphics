import type { CSSProperties, ReactNode } from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { cciTheme as theme } from "../../../../shared/themes/cci";
import type { Slide02Timing } from "../timing";

export type ContributionMotion = {
  from: number;
  end: number;
  timing: Slide02Timing;
};

const ease = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease } as const;

export const Reveal = ({
  from, until, style, children,
}: {
  from?: number;
  until?: number;
  style?: CSSProperties;
  children: ReactNode;
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{
      ...style,
      opacity: (from === undefined ? 1 : interpolate(frame, [from, from + 12], [0, 1], clamp)) *
        (until === undefined ? 1 : interpolate(frame, [until - 6, until], [1, 0], clamp)),
      translate: from === undefined ? undefined :
        `0px ${interpolate(frame, [from, from + 12], [8, 0], clamp)}px`,
    }}>
      {children}
    </div>
  );
};

export const Connection = ({ pose, motion }: {
  pose: string;
  motion?: ContributionMotion;
}) => {
  const frame = useCurrentFrame();
  const contribution = motion?.timing.subCue("knowledgeContribution") ?? 0;
  const separate = motion?.timing.scenes[1].from ?? 0;
  const invited = motion?.timing.scenes[2].from ?? 0;
  const progress = !motion ? (pose === "separate" ? 0 : 1)
    : frame < separate
      ? interpolate(frame, [contribution, contribution + 24], [0, 1], clamp)
      : frame < invited
        ? interpolate(frame, [separate, separate + 12], [1, 0], clamp)
        : interpolate(frame, [invited, invited + 20], [0, 1], clamp);
  return (
    <>
      <path data-slide02-connection d="M520 590H1062" pathLength={1} stroke={theme.teal} strokeWidth={2.4}
        strokeDasharray={1} strokeDashoffset={1 - progress} opacity={progress === 0 ? 0 : 1} />
      <circle cx="1060" cy="590" r={6} fill={theme.teal} opacity={progress} />
      {motion && pose === "expertise" ? (
        <circle cy={590} r={5} fill={theme.teal}
          cx={interpolate(frame, [motion.timing.subCue("teamMember"), motion.timing.subCue("teamMember") + 24], [520, 1060], clamp)}
          opacity={frame >= motion.timing.subCue("teamMember") &&
            frame < motion.timing.subCue("teamMember") + 24 ? 1 : 0} />
      ) : null}
    </>
  );
};

export const StageMarker = ({ from, children }: { from?: number; children: ReactNode }) => {
  const frame = useCurrentFrame();
  return (
    <g opacity={from === undefined ? 1 : interpolate(frame, [from, from + 12], [0, 1], clamp)}>
      {children}
    </g>
  );
};

export const StagePath = ({ from }: { from?: number }) => {
  const frame = useCurrentFrame();
  return (
    <path d="M30 188h580" stroke={theme.ink} pathLength={1} strokeDasharray={1}
      strokeDashoffset={from === undefined ? 0 : interpolate(frame, [from, from + 24], [1, 0], clamp)} />
  );
};
