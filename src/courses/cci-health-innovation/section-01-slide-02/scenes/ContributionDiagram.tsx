import type { ReactNode } from "react";
import { AbsoluteFill } from "remotion";
import { AnimatedHeading } from "../../../../shared/components/cci/AnimatedHeading";
import { PerspectiveIcon } from "../../../../shared/components/cci/PerspectiveIcon";
import { cciContentLayout as layout, cciTheme as theme } from "../../../../shared/themes/cci";
import { Connection, Reveal, StageMarker, StagePath } from "./NarrationMotion";
import type { ContributionMotion } from "./NarrationMotion";

export type ContributionPose =
  | "definition"
  | "separate"
  | "invited"
  | "need"
  | "assumption"
  | "options"
  | "decision"
  | "expertise"
  | "voices"
  | "summary";

const headings: Record<ContributionPose, { title: string; detail: string }> = {
  definition: {
    title: "Who is a consumer in this context?",
    detail: "Relevant lived experience + a role in informing and shaping the work",
  },
  separate: {
    title: "Experience is not involvement",
    detail: "Being a patient or carer does not automatically mean being involved.",
  },
  invited: {
    title: "What role are they invited to play?",
    detail: "A role in informing and shaping the work",
  },
  need: {
    title: "Help the team understand a need",
    detail: "A possible contribution",
  },
  assumption: {
    title: "Help the team question an assumption",
    detail: "A possible contribution",
  },
  options: {
    title: "Help the team consider options",
    detail: "A possible contribution",
  },
  decision: {
    title: "Help inform a decision",
    detail: "Contributing to the team's thinking",
  },
  expertise: {
    title: "Your expertise is lived experience",
    detail: "No need to become a science or technology expert",
  },
  voices: {
    title: "Whose voices are needed?",
    detail: "Which lived experience is relevant to this work?",
  },
  summary: {
    title: "Relevant lived experience",
    detail: "+ a role in informing and shaping the work",
  },
};

const WorkspaceDrawing = ({ children }: { children: ReactNode }) => (
  <svg
    width={590}
    height={190}
    viewBox="0 0 590 190"
    fill="none"
    stroke={theme.ink}
    strokeWidth={2.2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const ExampleDrawing = ({ pose }: { pose: ContributionPose }) => {
  if (pose === "need") {
    return (
      <WorkspaceDrawing>
        <circle cx="275" cy="80" r="51" fill={theme.blue} />
        <path d="m312 117 44 44" />
        <circle cx="275" cy="80" r="13" fill={theme.mint} stroke={theme.teal} />
        <path d="M253 80h-14m72 0h-14M275 58V44m0 72v-14" stroke={theme.teal} />
      </WorkspaceDrawing>
    );
  }
  if (pose === "assumption") {
    return (
      <WorkspaceDrawing>
        <path d="M241 23h106a20 20 0 0 1 20 20v58a20 20 0 0 1-20 20h-36l-27 21v-21h-43a20 20 0 0 1-20-20V43a20 20 0 0 1 20-20Z" fill={theme.lilac} />
        <path d="M280 58c0-22 34-22 34-2 0 13-17 11-17 26" />
        <circle cx="297" cy="98" r="1.5" fill={theme.ink} />
        <path d="M160 163h98m55 0h116" stroke={theme.lilacInk} />
      </WorkspaceDrawing>
    );
  }
  if (pose === "options" || pose === "decision") {
    return (
      <WorkspaceDrawing>
        <path d="M130 94h55c45 0 40-48 90-48h72M185 94c45 0 40 48 90 48h72" />
        <rect x="317" y="23" width="62" height="46" rx="18" fill={theme.blue} />
        <rect x="317" y="119" width="62" height="46" rx="18" fill={theme.lilac} />
        {pose === "decision" ? (
          <>
            <path d="M379 46c44 0 28 48 68 48m-68 48c44 0 28-48 68-48" />
            <circle cx="465" cy="94" r="25" fill={theme.surface} />
            <circle cx="465" cy="94" r="7" fill={theme.teal} stroke="none" />
          </>
        ) : null}
      </WorkspaceDrawing>
    );
  }
  return null;
};

const exampleLabels: Partial<Record<ContributionPose, string>> = {
  need: "Understand a need",
  assumption: "Question an assumption",
  options: "Consider options",
  decision: "Inform a decision",
};

const Expertise = ({ motion }: { motion?: ContributionMotion }) => (
  <div style={{ display: "flex", gap: 48, justifyContent: "center", paddingTop: 32 }}>
    {([
      ["experience", theme.mint, "Lived-experience", "expertise"],
      ["innovation", theme.blue, "Scientific / technical", "expertise"],
    ] as const).map(([name, background, first, second]) => (
      <Reveal key={name} from={motion && (name === "experience" ? motion.from : motion.from + 94)}
        style={{ textAlign: "center", width: 236 }}>
        <div style={{ width: 104, height: 104, borderRadius: 52, margin: "0 auto 15px", background, display: "grid", placeItems: "center" }}>
          <PerspectiveIcon name={name} size={66} />
        </div>
        <div style={{ fontSize: 24, lineHeight: 1.35 }}>{first}<br />{second}</div>
      </Reveal>
    ))}
  </div>
);

const ProjectStages = ({ motion }: { motion?: ContributionMotion }) => (
  <>
    <svg
      style={{ position: "absolute", left: 1030, top: 402 }}
      width={690}
      height={275}
      viewBox="0 0 690 275"
      fill="none"
      stroke={theme.teal}
      strokeWidth={2}
      aria-hidden="true"
    >
      <StagePath from={motion?.from} />
      {([
        [100, theme.mint], [350, theme.peach], [600, theme.lilac],
      ] as const).map(([x, fill], index) => (
        <StageMarker key={x} from={motion && motion.from + index * 10}>
          <circle cx={x} cy={188} r={13} fill={theme.paper} />
          <path d={`M${x} 155v-45`} strokeDasharray="4 7" />
          <path d={`M${x - 26} 30h52a15 15 0 0 1 15 15v31a15 15 0 0 1-15 15h-17l-15 13V91h-20a15 15 0 0 1-15-15V45a15 15 0 0 1 15-15Z`} fill={fill} />
          <path d={`M${x - 13} 57h26m-26 12h16`} />
        </StageMarker>
      ))}
    </svg>
    <div style={{ position: "absolute", left: 1055, top: 641, width: 650, display: "flex", justifyContent: "space-between", alignItems: "start", fontSize: 24, textAlign: "center", lineHeight: 1.4 }}>
      <Reveal from={motion?.timing.subCue("concept")} style={{ width: 148 }}>Concept</Reveal>
      <Reveal from={motion?.timing.subCue("designImplementation")} style={{ width: 250 }}>Design &amp;<br />implementation</Reveal>
      <Reveal from={motion?.timing.subCue("delivery")} style={{ width: 148 }}>Delivery</Reveal>
    </div>
    <div style={{ position: "absolute", top: 778, left: 1055, width: 650, textAlign: "center", color: theme.teal, fontSize: 26, fontWeight: 600 }}>
      Relevant voices across the work
    </div>
  </>
);

export const ContributionDiagram = ({
  pose,
  beatNumber,
  motion,
}: {
  pose: ContributionPose;
  beatNumber: number;
  motion?: ContributionMotion;
}) => {
  const copy = headings[pose];
  const separate = pose === "separate";
  const stages = pose === "voices";
  const summary = pose === "summary";
  const definition = pose === "definition";
  return (
    <AbsoluteFill
      data-slide02-pose={pose}
      style={{
        background: theme.paper,
        color: theme.ink,
        fontFamily: theme.fontFamily,
        overflow: "hidden",
      }}
    >
      <div data-cci-eyebrow style={{ position: "absolute", left: theme.safeX, top: layout.eyebrowTop, color: theme.teal, fontSize: 19, letterSpacing: 2, fontWeight: 600 }}>
        {summary ? "THE CONTRIBUTION ROLE MATTERS" : "RELEVANT EXPERIENCE. PURPOSEFUL INVOLVEMENT."}
      </div>
      <Reveal until={motion && (summary ? undefined : motion.end)} style={{ position: "absolute", inset: 0 }}>
      <AnimatedHeading
        motionId="slide02-title"
        from={motion?.from ?? 0}
        style={{ position: "absolute", left: theme.safeX, right: theme.safeX, top: layout.titleTop, fontSize: summary ? 58 : 74, lineHeight: 1.15, letterSpacing: -2.5, fontWeight: 700 }}
      >
        {copy.title}
      </AnimatedHeading>
      <AnimatedHeading
        motionId="slide02-detail"
        from={(motion?.from ?? 0) + 5}
        style={{ position: "absolute", left: theme.safeX + 4, right: theme.safeX, top: summary ? layout.summaryDetailTop : layout.detailTop, fontSize: summary ? 58 : 28, lineHeight: 1.2, letterSpacing: summary ? -1.6 : 0, color: summary ? theme.teal : theme.muted, fontWeight: summary ? 600 : 400 }}
      >
        {copy.detail}
      </AnimatedHeading>
      </Reveal>

      <div data-cci-diagram style={{
        position: "absolute", inset: 0,
        translate: `0px ${layout.diagramOffsetY}px`,
        scale: layout.diagramScale,
        transformOrigin: "960px 590px",
      }}>
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080} viewBox="0 0 1920 1080" fill="none" aria-hidden="true">
        {motion ? <Connection pose={pose} motion={motion} /> : !separate ? (
          <path d="M520 590H1062" stroke={theme.teal} strokeWidth={2.4} />
        ) : null}
        {!stages ? (
          <rect x="1060" y="426" width="652" height="350" rx="90" fill={theme.peach} />
        ) : null}
        <circle cx="390" cy="590" r="130" fill={theme.mint} stroke={theme.teal} strokeWidth={1.7} />
        {!motion && !separate ? <circle cx="1060" cy="590" r={6} fill={theme.teal} /> : null}
      </svg>
      <div style={{ position: "absolute", left: 336, top: 534, color: theme.teal }}>
        <PerspectiveIcon name="experience" size={108} />
      </div>
      <Reveal from={motion && pose === "definition" ? motion.timing.subCue("relevantExperience") : undefined}
        style={{ position: "absolute", left: 166, top: 749, width: 448, textAlign: "center" }}>
        <div style={{ fontSize: 29, fontWeight: 600 }}>Relevant lived experience</div>
        <Reveal from={motion && (definition ? motion.timing.subCue("includingCarers") :
          pose === "expertise" ? motion.timing.subCue("realisticPerspective") : undefined)}
          style={{ fontSize: 24, color: theme.muted, lineHeight: 1.4, marginTop: 12 }}>
          {pose === "expertise" ? "Relevant, realistic perspective" : "Including patients and carers"}
        </Reveal>
      </Reveal>

      <Reveal from={motion && (definition ? motion.timing.subCue("knowledgeContribution") :
        ["separate", "invited", "summary"].includes(pose) ? motion.from : undefined)}
        style={{ position: "absolute", left: 622, top: separate ? 553 : 514, width: 338, textAlign: "center" }}>
        <div style={{
          display: "inline-block",
          padding: separate ? "14px 0" : "15px 26px",
          borderRadius: 28,
          border: separate ? "none" : `1.5px solid ${theme.teal}`,
          background: theme.paper,
          color: separate ? theme.muted : theme.teal,
          fontSize: definition ? 24 : 25,
          fontWeight: 600,
          lineHeight: 1.35,
        }}>
          {separate ? "Not automatic" : definition ? <>A role in informing<br />and shaping</> : "Invited to contribute"}
        </div>
      </Reveal>

      {stages ? <ProjectStages motion={motion} /> : (
        <>
          <div style={{ position: "absolute", left: 1082, top: 448, width: 608, textAlign: "center", fontSize: 18, fontWeight: 600, color: theme.peachInk, letterSpacing: 2 }}>
            INNOVATION WORKSPACE
          </div>
          {pose === "expertise" ? (
            <div style={{ position: "absolute", left: 1082, top: 468, width: 608 }}>
              <Expertise motion={motion} />
            </div>
          ) : exampleLabels[pose] ? (
            <>
              <Reveal from={motion?.from} style={{ position: "absolute", left: 1090, top: 485 }}>
                <ExampleDrawing pose={pose} />
              </Reveal>
              <Reveal from={motion?.from} style={{ position: "absolute", left: 1090, top: 702, width: 590, textAlign: "center", fontSize: 29, fontWeight: 600 }}>
                {exampleLabels[pose]}
              </Reveal>
            </>
          ) : (
            <>
              <Reveal from={motion && (summary ? motion.from : undefined)}
                style={{ position: "absolute", left: 1334, top: 510, color: theme.peachInk }}>
                <PerspectiveIcon name="innovation" size={104} />
              </Reveal>
              <Reveal from={motion && (definition ? motion.timing.subCue("informShape") : motion.from)}
                style={{ position: "absolute", left: 1100, top: 660, width: 572, textAlign: "center", fontSize: 29, fontWeight: 600 }}>
                {summary ? "Inform and shape innovation" : "Innovation in development"}
              </Reveal>
            </>
          )}
        </>
      )}
      </div>
      {!motion ? <div style={{ position: "absolute", left: theme.safeX, right: theme.safeX, top: 954, borderTop: `1px solid ${theme.rule}`, paddingTop: 22, display: "flex", justifyContent: "space-between", fontSize: 17, color: theme.muted, letterSpacing: 0.6 }}>
        <span>STORYBOARD ONLY / WORKING DRAFT NARRATION / NO AUDIO TIMING</span>
        <span>{String(beatNumber).padStart(2, "0")} / 10</span>
      </div> : null}
    </AbsoluteFill>
  );
};
