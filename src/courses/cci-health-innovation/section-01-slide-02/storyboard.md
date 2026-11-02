# Slide 2 - one continuous visual story

**Awaiting human storyboard re-approval. Production paused at user request.**

## Scope and source

- Production ID: `CCIHealthInnovation-S01-Slide02`.
- Storyboard ID: `CCIHealthInnovation-S01-Slide02-Storyboard`.
- The user approved this nine-state structure and continuity on 2026-11-02.
  Their authorized final minor refinements are stage labels at 32 px and
  contribution-list opacity at 60% in Beat 9, with no structural change.
  Approval and production start are recorded through the shared workflow.
  The explicit request authorizes the full sequence rather than another
  standalone proof cut. Slide 1 remains unchanged.
- That earlier authorization is now paused: the latest request requires these
  spacing and callout corrections to return to storyboard review before animation.
- Preserve [the supplied draft](./narration-script.md) and actual temporary audio.
  [Measured audio evidence](./audio-analysis.json) remains available; recording
  and sidecar caption provenance are unchanged, with human transcript review needed.
- Earlier storyboard artifacts and status are archived under
  `out/slide02-continuity-review/previous-storyboard/`. Earlier approval and QA
  do not apply to these revised states.

## Continuous visual concept

**One title, two persistent anchors, one evolving relationship.**

Keep **Who is a consumer in this context?** at y=72 for the whole teaching
concept. Keep the header-free CCI paper, navy, teal and pastels, Inter hierarchy
and thin SVG line icons. Remove the additional top eyebrow entirely; no course
name, breadcrumb or RETProgram header. Move the supporting concept up to y=177
and the diagram up 50 px. Expand the innovation workspace from 400 to 440 px
high, increase contribution-row spacing from 64 to 72 px, and slightly enlarge
the experience node/icon. The reclaimed room benefits the existing diagram and
labels, without adding copy. These anchors remain fixed across all nine states.

The relevant-lived-experience node and peach innovation workspace start
separate. A dashed link with **Experience alone != involvement** (rendered
using the not-equal symbol) makes the distinction explicit. That same line
becomes solid **Invited to contribute** at the invitation explanation.
Neither the person nor the innovation exits and re-enters.

**Innovation in development** and its lightbulb stay visible in the same
workspace. The four possible contributions accumulate as compact icon/label
rows there, not as replacement slides or a compulsory ordered process.
Beat 8 shifts focus to the existing person with a stronger teal outline, while
slightly softening the workspace and keeping all four contributions legible.
A compact mint callout in the gap beside the node, linked by a fine leader,
reads **Lived-experience expertise**, Relevant, realistic perspective,
**Technical expertise not required**. No text block is stacked beneath the
consumer. All anchor positions remain fixed; narration carries the fuller
explanation. Beat 9 retains this entire upper tier in place, restores normal
workspace identity while softening the four contribution rows and expertise
callout. Keep all three lines, including **Technical expertise not required**,
with identical wording, typography, spacing and 420 x 176 px dimensions from
Beat 8 to Beat 9; only the overall opacity changes to 80%. Center
**Whose lived-experience voices are needed?** in a separate lower tier, with
the heading unchanged at canvas y=825, approximately 79 px below the restored
full-height callout, with 38 px
hierarchy. A 1440 px line-and-node pathway uses the canvas width below the question:
Concept -> Design & implementation -> Delivery. No short stem crowds it against
the innovation workspace. Add one consistent small speech bubble at each stage
to reinforce relevant voices rather than just a project timeline. Stage labels
are 32 px; the contribution list is softened to 60% opacity in Beat 9 only.
Retain the pathway and labels in place; lower only the speech bubbles another
12 px and shorten their leaders, giving 34 px between the question's line box
and the top of the bubbles. Nodes remain evenly spaced at 720 px intervals.
Stage-label text stays above y=1028, inside the bottom safe area.
Keep full-opacity dark-teal 2 px pathway/icon strokes; check their contrast after
compression during production QA, not as a claimed result of this static review.
Move the storyboard-only
footer below the labels; the heading and upper diagram do not move.
In production, introduce the question and progressively reveal the pathway,
bubbles and labels from left to right on the measured phrases; the storyboard shows its settled
state only. The completed final state is intended to hold from frame 1695 through
1775 (2.7 seconds), through the last narrated clause.
There is no tenth summary.

## State changes

The [manifest](./storyboard.config.json) is the canonical detailed description.
Every beat includes Narration cue, Visual, Purpose, Transition intention,
**Persists**, **Adds or changes**, **Attention target** and justified **Removes**.
The generated [review copy](../../../../out/storyboards/CCIHealthInnovation-S01-Slide02/storyboard.md)
includes the full fields and PNG for each state.

| Beat | Persists | Adds or changes | Attention target | Removes / reason |
|---|---|---|---|---|
| 1. Distinct anchors | Establish fixed title, person and innovation identity | Separate experience node and workspace | Gap between concepts | None |
| 2. Not automatic involvement | Same title, positions, objects and identity | Dashed link; Experience alone != involvement | Broken relationship | None |
| 3. Invited contribution | Same connector component and anchored objects | Dashed becomes solid; Invited to contribute | Established relationship | Old connector label/dash treatment: the relationship changes to explicit invitation; no component is replaced |
| 4. Understand a need | All anchors, identity and solid invitation | First icon/label row | New first contribution | None |
| 5. Question an assumption | First row and all anchored components | Second row | New second contribution | None |
| 6. Consider options | First two rows and all anchored components | Third row | New third contribution | None |
| 7. Inform a decision | First three rows and all anchored components | Fourth row; all four now coexist | Fourth contribution within the complete set | None |
| 8. Expertise | Entire connected system, fixed positions and complete list | Stronger teal person outline, softer workspace, compact linked callout in inter-node gap | Relevant, realistic lived-experience expertise | None |
| 9. Whose voices? (final) | Entire upper system, four contributions and identical three-line expertise callout, all anchored | List at 60%, callout at 80%; question stays y=825; 34 px clear space to bubbles; line/nodes/labels fixed | Relevant voices across the work | None |

## Reusable scene structure

`scenes/ContributionStory.tsx` is the shared storyboard/production surface
built from CCI tokens and `PerspectiveIcon`. It owns the persistent
person, workspace, identity, connection and cumulative contribution rows.
`Storyboard.tsx` changes its `state` prop without remounting that surface or
keying it by beat. Hidden not-yet-introduced additions reserve stable positions;
they are not visible placeholder bullets.

Production supplies measured frame/timing props for restrained reveals and focus
changes, while the storyboard omits them for settled poses. Neither surface keys
or remounts the scene per beat. The legacy `ContributionDiagram` is no longer
wired into production. Approved storyboard PNGs are preserved for regression
comparison. This user-requested correction regenerates review artifacts and
invalidates the prior approval; do not resume animation before renewed approval.

## Narration-led timing assumptions

The 60-frame slots are Studio inspection holds only: nine states / 540 frames,
not the proposed production runtime. No evenly divided production timing.
Production retains the measured actual audio as master and the existing
phrase onsets for invitation, each contribution and the expertise passage.
Contribution rows remain after appearing; short phrases do not require rapid
full-frame replacements.

The final voices passage starts at the measured 46.881655 seconds; the
concept, design/implementation and delivery phrases remain separate local
changes within that state. Hold the established final state to the recording's
59.16734693877551-second end (1776 video frames at 30 fps). Absorb the former
recap interval into this final state; do not add/extend narration. This is a
production behavior. The original audio and recording-based sidecars remain
unchanged; their machine transcription still requires human review.

## Review and stop

The approved generation contains individual
`beat-01.png` through `beat-09.png`, labelled `storyboard.png` and `storyboard.md`
under `out/storyboards/CCIHealthInnovation-S01-Slide02/`.

Inspect the storyboard composition and stills for continuity, hierarchy,
legibility, spacing and narrative meaning. Confirm that the broken-to-solid
relationship, cumulative examples and final voices state tell one continuous
story without changing the main title. Full-motion QA uses the normal shared
workflow; final export still requires explicit human video approval.

**Awaiting human storyboard re-approval. Do not proceed to animation yet.**
