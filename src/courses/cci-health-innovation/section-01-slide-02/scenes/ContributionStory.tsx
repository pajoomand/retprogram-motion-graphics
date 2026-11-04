import { AbsoluteFill, Easing, interpolate } from "remotion";
import { PerspectiveIcon } from "../../../../shared/components/cci/PerspectiveIcon";
import { cciTheme as theme } from "../../../../shared/themes/cci";
import type { Slide02Timing } from "../timing";

type StoryMotion = { frame: number; timing: Slide02Timing };
const easing = Easing.bezier(0.16, 1, 0.3, 1);
const progress = (motion: StoryMotion | undefined, from: number, duration = 18) =>
  motion ? interpolate(motion.frame, [from, from + duration], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing,
  }) : 1;
const sceneStart = (motion: StoryMotion | undefined, pose: ContributionState) => {
  if (!motion) return 0;
  const scene = motion.timing.scenes.find((item) => item.pose === pose);
  if (!scene) throw new Error(`Missing Slide 2 motion cue: ${pose}`);
  return scene.from;
};

export const contributionStates = [
  "definition", "separate", "invited", "need", "assumption",
  "options", "decision", "expertise", "voices",
] as const;
export type ContributionState = typeof contributionStates[number];

const contributions = [
  ["need", "Understand a need"],
  ["assumption", "Question an assumption"],
  ["options", "Consider options"],
  ["decision", "Inform a decision"],
] as const;

const ContributionIcon = ({ kind }: { kind: typeof contributions[number][0] }) => (
  <svg width={36} height={36} viewBox="0 0 36 36" fill="none"
    stroke={theme.ink} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {kind === "need" ? <>
      <circle cx={15} cy={15} r={9} fill={theme.blue} /><path d="m22 22 9 9M11 15h8m-4-4v8" />
    </> : kind === "assumption" ? <>
      <rect x={5} y={4} width={26} height={27} rx={8} fill={theme.lilac} />
      <path d="M14 13c0-6 10-6 10 0 0 4-5 4-5 8" /><circle cx={19} cy={26} r={1} fill={theme.ink} />
    </> : kind === "options" ? <>
      <path d="M3 18h8c6 0 6-10 13-10h5M11 18c6 0 6 10 13 10h5" />
      <circle cx={29} cy={8} r={4} fill={theme.blue} /><circle cx={29} cy={28} r={4} fill={theme.lilac} />
    </> : <>
      <path d="M3 8c9 0 7 10 17 10M3 28c9 0 7-10 17-10" />
      <circle cx={26} cy={18} r={8} fill={theme.surface} /><circle cx={26} cy={18} r={2.5} fill={theme.teal} stroke="none" />
    </>}
  </svg>
);

const ContributionRows = ({ count, attention, subdued, motion }: {
  count: number; attention: number; subdued: boolean; motion?: StoryMotion;
}) => (
  <div data-contribution-list style={{
    position: "absolute", left: 1080, top: 426, width: 640,
    opacity: 1 - 0.4 * (subdued ? progress(motion, sceneStart(motion, "voices")) : 0),
  }}>
    {contributions.map(([kind, label], index) => (
      <div key={kind} data-contribution={kind} data-revealed={index < count}
        style={{
          height: 72, display: "flex", gap: 20, alignItems: "center",
          visibility: index < count ? "visible" : "hidden",
          opacity: progress(motion, sceneStart(motion, kind), 12),
          translate: `0 ${4 * (1 - progress(motion, sceneStart(motion, kind), 12))}px`,
          color: index === attention ? theme.teal : theme.ink,
          fontSize: 28, fontWeight: index === attention ? 600 : 400,
        }}>
        <ContributionIcon kind={kind} /><span>{label}</span>
      </div>
    ))}
  </div>
);

const VoicesExtension = ({ visible, motion }: { visible: boolean; motion?: StoryMotion }) => (
  <div data-voices-extension style={{ position: "absolute", inset: 0, visibility: visible ? "visible" : "hidden" }}>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, translate: "0 40px" }} fill="none"
      stroke={theme.teal} strokeWidth={2} aria-hidden="true">
      <path data-voices-path d="M240 974H1680" pathLength={motion ? 1 : undefined} strokeDasharray={motion ? 1 : undefined}
        strokeDashoffset={motion ? 1 -
          0.5 * progress(motion, motion.timing.subCue("designImplementation")) -
          0.5 * progress(motion, motion.timing.subCue("delivery")) : 0} />
      <path d="m594 968 6 6-6 6" opacity={progress(motion, motion?.timing.subCue("designImplementation") ?? 0)} />
      <path d="m1314 968 6 6-6 6" opacity={progress(motion, motion?.timing.subCue("delivery") ?? 0)} />
      {[240, 960, 1680].map((x, index) => (
        <g key={x} opacity={progress(motion, motion?.timing.subCue(
          (["concept", "designImplementation", "delivery"] as const)[index]) ?? 0, 12)}>
          <circle cx={x} cy={974} r={9} fill={theme.mint} />
          <g data-stage-voice>
            <path d={`M${x} 965v-2`} />
            <g transform="translate(0 12)">
              <path d={`M${x - 14} 914h28a7 7 0 0 1 7 7v16a7 7 0 0 1-7 7h-8l-10 7v-7h-10a7 7 0 0 1-7-7v-16a7 7 0 0 1 7-7Z`}
                fill={theme.mint} />
              <path d={`M${x - 10} 925h20m-20 8h13`} />
            </g>
          </g>
        </g>
      ))}
    </svg>
    <div data-voices-heading style={{
      position: "absolute", left: theme.safeX, right: theme.safeX, top: 875,
      textAlign: "center", fontSize: 38, fontWeight: 600, color: theme.teal,
      opacity: progress(motion, sceneStart(motion, "voices")),
    }}>
      Whose lived-experience voices are needed?
    </div>
    <div data-stage-label style={{ position: "absolute", left: 140, top: 1034, width: 200, textAlign: "center", fontSize: 32,
      opacity: progress(motion, motion?.timing.subCue("concept") ?? 0, 12) }}>Concept</div>
    <div data-stage-label style={{ position: "absolute", left: 710, top: 1034, width: 500, textAlign: "center", fontSize: 32,
      opacity: progress(motion, motion?.timing.subCue("designImplementation") ?? 0, 12) }}>
      Design &amp; implementation
    </div>
    <div data-stage-label style={{ position: "absolute", left: 1580, top: 1034, width: 200, textAlign: "center", fontSize: 32,
      opacity: progress(motion, motion?.timing.subCue("delivery") ?? 0, 12) }}>Delivery</div>
  </div>
);

export const ContributionStory = ({ state, motion, consumerFirstOpening = false }: {
  state: ContributionState; motion?: StoryMotion; consumerFirstOpening?: boolean;
}) => {
  const expansionStart = sceneStart(motion, "separate");
  const expansion = consumerFirstOpening
    ? motion ? interpolate(motion.frame, [expansionStart, expansionStart + 42], [0, 1], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
      easing: Easing.bezier(0.42, 0, 0.58, 1),
    }) : state === "definition" ? 0 : 1
    : 1;
  const introduction = consumerFirstOpening && expansion === 0;
  const consumerOffsetX = 600 * (1 - expansion);
  const consumerOffsetY = 45 * (1 - expansion);
  const workspaceReveal = consumerFirstOpening
    ? motion ? progress(motion, expansionStart + 30) : state === "definition" ? 0 : 1
    : 1;
  const descriptorReveal = consumerFirstOpening
    ? motion ? 1 - progress(motion, expansionStart) : state === "definition" ? 1 : 0
    : 0;
  const index = contributionStates.indexOf(state);
  const count = Math.max(0, Math.min(4, index - 2));
  const expertise = index >= 7;
  const connected = index >= 2;
  const invitation = connected ? progress(motion, sceneStart(motion, "invited"), 20) : 0;
  const connectionReveal = index ? progress(motion, expansionStart + (consumerFirstOpening ? 48 : 0), 20) : 0;
  const voices = state === "voices" ? progress(motion, sceneStart(motion, "voices")) : 0;
  const expertiseReveal = expertise ? progress(motion, sceneStart(motion, "expertise")) : 0;
  const focus = expertiseReveal * (1 - voices);
  return (
    <AbsoluteFill data-slide02-pose={state} style={{
      background: theme.paper, color: theme.ink, fontFamily: theme.fontFamily, overflow: "hidden",
    }}>
      <div data-cci-text="slide02-title" style={{
        position: "absolute", left: theme.safeX, top: 72, right: theme.safeX,
        fontSize: 74, lineHeight: 1.15, letterSpacing: -2.5, fontWeight: 700,
      }}>Who is a consumer in this context?</div>
      <div style={{
        position: "absolute", left: theme.safeX + 4, top: 177,
        color: theme.muted, fontSize: 28, opacity: workspaceReveal,
        visibility: introduction ? "hidden" : undefined,
      }}>Relevant lived experience + a role in informing and shaping the work</div>
      <div data-cci-diagram data-persistent="diagram" style={{ position: "absolute", left: 0, right: 0, top: -50, bottom: 50 }}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }} fill="none" aria-hidden="true">
          <rect data-persistent="workspace" x={1030} y={330} width={740} height={440} rx={64}
            fill={theme.peach} opacity={workspaceReveal * (1 - 0.35 * focus)}
            visibility={introduction ? "hidden" : undefined} />
          <circle data-persistent="experience" cx={360 + consumerOffsetX} cy={545 + consumerOffsetY} r={128}
            fill={theme.mint} stroke={theme.teal} strokeWidth={1.7 + 2.8 * expertiseReveal - voices} />
          <path data-persistent="connector" data-connection={connected ? "solid" : index === 1 ? "dashed" : "absent"}
            d="M488 545H1030" stroke={theme.teal} strokeWidth={2.4}
            strokeDasharray={connected && invitation === 1 ? undefined : `10 ${10 * (1 - invitation)}`}
            opacity={connectionReveal} visibility={index ? "visible" : "hidden"} />
          <circle cx={1030} cy={545} r={5} fill={theme.teal} opacity={invitation} visibility={connected ? "visible" : "hidden"} />
          <path d="M470 625H550L580 650" stroke={theme.teal} strokeWidth={1.5}
            opacity={expertiseReveal} visibility={expertise ? "visible" : "hidden"} />
        </svg>
        <div data-persistent="person-icon" style={{
          position: "absolute", left: 302 + consumerOffsetX, top: 485 + consumerOffsetY, color: theme.teal,
        }}>
          <PerspectiveIcon name="experience" size={116} />
        </div>
        <div data-persistent="experience-labels" style={{
          position: "absolute", left: 140 + 480 * (1 - expansion), top: 700 + consumerOffsetY,
          width: 440 + 240 * (1 - expansion), textAlign: "center",
        }}>
          <div style={{ fontSize: 29, fontWeight: 600 }}>Relevant lived experience</div>
          {consumerFirstOpening && (motion || introduction) ? <div data-opening-expertise style={{
            position: motion ? "absolute" : undefined, top: motion ? 47 : undefined,
            width: "100%", fontSize: 25, color: theme.muted, marginTop: motion ? 0 : 12,
            opacity: descriptorReveal, visibility: descriptorReveal ? "visible" : "hidden",
          }}>
            Expertise of a health condition or issue
          </div> : null}
          <div data-patient-carer-support style={{
            fontSize: 24, marginTop: 12 + (motion ? 42 * (1 - expansion) : 0), color: theme.muted,
            opacity: connected ? 1 - progress(motion, sceneStart(motion, "invited"), 18) : 1,
          }}>Including patients and carers</div>
        </div>
        <div data-persistent="relationship-label" style={{
          position: "absolute", left: 530, top: connected ? 464 + 23 * invitation : index === 1 ? 464 : 487, width: 450, textAlign: "center",
          visibility: index ? "visible" : "hidden",
          opacity: connected ? invitation : connectionReveal,
        }}>
          <span style={{
            display: "inline-block", background: theme.paper, color: connected ? theme.teal : theme.muted,
            padding: "12px 18px", borderRadius: 28, fontSize: 26, lineHeight: 1.35, fontWeight: 600,
            border: connected ? `1.5px solid ${theme.teal}` : "none",
          }}>{connected ? "Invited to contribute" : "Experience alone \u2260 involvement"}</span>
        </div>
        <div data-workspace-content style={{
          position: "absolute", inset: 0, opacity: workspaceReveal * (1 - 0.22 * focus),
          visibility: introduction ? "hidden" : undefined,
        }}>
          <div data-persistent="innovation-identity" style={{
          position: "absolute", left: 1072, top: 356, display: "flex", gap: 18,
          alignItems: "center", fontSize: 29, fontWeight: 600,
        }}>
          <PerspectiveIcon name="innovation" size={40} /><span>Innovation in development</span>
          </div>
          <ContributionRows count={count} attention={index >= 3 && index <= 6 ? count - 1 : -1}
            subdued={state === "voices"} motion={motion} />
        </div>
        <div data-expertise style={{
          position: "absolute", left: 580, top: 620, width: 420,
          padding: "18px 22px", boxSizing: "border-box", borderRadius: 22,
          background: theme.mint, border: `1px solid ${theme.teal}`,
          opacity: expertiseReveal * (1 - voices * 0.2),
          height: 176,
          visibility: expertise ? "visible" : "hidden",
        }}>
          <div style={{ color: theme.teal, fontSize: 28, fontWeight: 600 }}>Lived-experience expertise</div>
          <div style={{ marginTop: 10, fontSize: 25,
            opacity: progress(motion, motion?.timing.subCue("realisticPerspective") ?? 0) }}>Relevant, realistic perspective</div>
          <div data-technical-message style={{
            marginTop: 14, fontSize: 23, fontWeight: 600,
            opacity: progress(motion, motion?.timing.subCue("technicalExpertise") ?? 0),
          }}>
            Technical expertise not required
          </div>
        </div>
        <VoicesExtension visible={state === "voices"} motion={motion} />
      </div>
      {!motion ? <div data-storyboard-footer style={{
        position: "absolute", left: theme.safeX, right: theme.safeX, top: state === "voices" ? 1048 : 1004,
        display: "flex", justifyContent: "space-between", fontSize: state === "voices" ? 12 : 15, color: theme.muted,
      }}>
        <span>STORYBOARD RE-APPROVAL / STATE CHANGES, NOT SLIDES / INSPECTION HOLDS ONLY</span>
        <span>{String(index + 1).padStart(2, "0")} / 09</span>
      </div> : null}
    </AbsoluteFill>
  );
};
