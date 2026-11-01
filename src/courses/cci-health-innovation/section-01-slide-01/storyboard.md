# CCI Slide 1 - production prototype

## Scope and approval

Course: CCI in Health Innovation. Section 1, Slide 1 only.
Composition: `CCIHealthInnovation-S01-Slide01`, 1920 x 1080, 30 fps.
The user approved this narration-led, complete Slide 1 prototype rather than
a separate 15-20-second excerpt. Slides 2-7 are out of scope.

Human visual review completed and approved by the user on **2026-10-29** for
the refined Slide 1 export and QA run `2026-10-29T06-33-49-306Z-14588`.
This includes the typography entrances and all seven reported static intervals.
Approval is visual only; temporary narration and machine-derived captions
retain their separate transcript/content review requirements.

The four relevant perspectives contribute **different forms of knowledge and
expertise**. Their visual presence does not assert equal relevance, weight or
authority for every innovation decision. Lived experience receives specific
focus when discussed, without replacing the other perspectives.

## Design and motion language

Primary reference:
[CCI course visual reference](../../../../references/cci-health-innovation/cci-slide-style-reference.png).
Use its warm paper, navy, thin line icons, pastel fields and strong type
hierarchy; do not copy the static slide, photographs or clinical examples.

- Paper `#FAF8F3`, navy `#142D4E`, teal `#2D706A`.
- Supporting blue `#E5EEF5`, peach `#FAE8DB`, lilac `#ECE7F5`, mint `#E3EFE9`.
- Inter; 74 px opening title, 58 px outcome, 29 px perspective names,
  24 px supporting labels, 40 px caption text.
- 96 px horizontal safe area; an optional Studio caption overlay reserves the
  lower canvas. Final MP4 output is clean, with separate WebVTT closed captions.
- A persistent central innovation-decision node anchors a single continuous
  diagram. Perspectives arrive near their destinations; connectors draw
  towards the central node, which accumulates coloured knowledge markers.
- Cubic ease-out translation/opacity/scale, no overshoot, bounce, spin or
  decorative perpetual motion. A short directional flow communicates
  convergence. Lived experience gains a thin teal outline, 1.2% scale emphasis
  and a second contribution flow during consumer involvement.
- Text entrances share a 14-frame ease-out from opacity 0 to 1 and a 10 px
  upward settle, without word-by-word motion or masks that clip glyphs.
  ONE PROBLEM starts at frame 8, the title at 13 and supporting line at 18
  (5-frame hierarchy stagger). The header and central decision label follow
  the same text rule. Each perspective title starts 5 frames after its
  narration cue and its supporting label 5 frames later; card/icon geometry
  keeps its existing relationship-driven motion independently of typography.
- At resolution, the outgoing title/support fade out over 14 frames, ending
  at frame 1057. DIFFERENT PERSPECTIVES starts at 1057 and BETTER-INFORMED
  DECISIONS at 1063 (6-frame stagger); both use independent 14-frame reveals,
  without a second parent fade. The payoff settles at 1077 (35.9 s); the
  complete graphic remains through the unchanged final frame, including the
  existing 57-frame closing phase.
- Retain these as the current CCI typography-motion standard: 14-frame,
  10 px ease-out reveals, 5-frame opening hierarchy offsets and 6-frame
  final-message stagger. Preserve the intentional final 3-4 second hold.
- Reviewed static holds are acceptable for absorbing narration and visual
  information, not technical failures. Do not remove them just to create
  continuous motion. In future work, avoid unnecessarily long stagnant sections
  with meaningful narration-synchronised secondary reveals, connector drawing,
  emphasis changes or information progression, never decorative ambient motion.
- No assertion that perspectives automatically guarantee better outcomes:
  the supplied outcome wording is **better-informed decisions**.

## Narration-led storyboard

Frame boundaries are nearest-frame measurements of acoustic sentence starts,
not equally sized sections. All phases retain the same continuous diagram.

| Start frame | Audio phrase onset | Treatment |
|---|---|---|
| 0 | Opening begins at approximately 0.1 s | Clean paper/header; central node forms; ONE PROBLEM and a brief title reveal. |
| 156 | 5.208685 s: A clinician... | Blue stethoscope card; Treatment + outcomes; draw knowledge connection. |
| 281 | 9.357891 s: An innovator or developer... | Peach lightbulb card; Feasibility + value; another contribution reaches the node. |
| 458 | 15.276100 s: A funder or purchaser... | Lilac funding/assessment icon; Cost + impact. |
| 627 | 20.903696 s: People who live... | Mint lived-experience card; Daily life + real needs; restrained outline and scale focus. |
| 820 | 27.341565 s: These perspectives matter... | All four remain visible; staggered directional flows converge. |
| 910 | 30.339909 s: Consumer involvement... | Strengthen the lived-experience connector and repeat its contribution flow; retain the complete network. |
| 1057 | 35.240 s: into the decisions being made... | Resolve heading into ONE PROBLEM / DIFFERENT PERSPECTIVES / BETTER-INFORMED DECISIONS. |
| 1077 | Final sentence continues | Revised typography has settled; complete graphic holds through the ending. |
| 1123 | Final sentence continues | Existing 57-frame closing phase remains; narration and optional closed captions continue to their recorded end. |

## Editable structure and reuse

The package uses `section-01-slide-01` as a single video slug to match the
repository's two-level course/video convention and generic QA label discovery,
rather than introducing an extra nested package level.

- [Video.tsx](./Video.tsx): one narration/caption timeline group.
- [content.ts](./content.ts): course copy, card palette and diagram layout.
- [timing.ts](./timing.ts): validated phase durations and derived cue frames.
- [video.config.ts](./video.config.ts): fixed output format, measured master
  duration and canonical audio URL.
- [scenes/](./scenes/): independent narrative heading, network, decision node
  and caption implementations.
- [Canonical captions](../../../../public/courses/cci-health-innovation/section-01-slide-01/closed-captions.json):
  one narration-timed source for optional Studio review, WebVTT and plain text.
  Edit the JSON rather than Studio's inline caption editor to avoid divergent
  export timings.
- [Shared CCI components](../../../shared/components/cci/): new opt-in icon,
  card, connector, heading, header and end-frame components.
- [Shared CCI theme](../../../shared/themes/cci.ts): prototype tokens only;
  no existing RETProgram defaults are changed.

For later slides, create a **new** package and ID after content/storyboard
approval; reuse the components without copying Slide 1's approved content.
This prototype establishes the current approved CCI visual and motion baseline,
not automatic approval of future videos, scripts or variants.
Keep course-specific wording and diagrams local. Refine shared defaults only
with explicit approval and regression checks.

For replacement narration: re-probe and locally transcribe the new source,
update provenance and measured duration, retime every relevant phrase/caption,
then update registration phase durations. The schema deliberately rejects
totals other than the current master length to prevent silent audio truncation.
Changing phase durations does not automatically retime the recording/captions.
Motion is authored for 30 fps; changing FPS requires deliberate retiming.

## QA and export

```cmd
npm run typecheck
npm run lint
npm run build
npm run qa:video -- CCIHealthInnovation-S01-Slide01
npm run export:video -- CCIHealthInnovation-S01-Slide01 out\exports\CCIHealthInnovation-S01-Slide01.mp4
```

The shared runner derives boundaries from `sceneDurations`, renders the complete
video and boundary triplets, creates a contact sheet, runs Playwright and
FFmpeg/FFprobe checks, and writes ignored JSON/Markdown reports. The opt-in
CCI Playwright test additionally checks cue accuracy, actual reveal timing,
text safe areas, font readiness, card overlaps and absence of burned-in captions
at representative times.
No course-local QA runner is introduced.

The export command writes `CCIHealthInnovation-S01-Slide01.mp4`, matching
`.vtt` closed captions and a `.txt` narration transcript to `out\exports`.
Cue order, timing bounds, duration and narration SHA-256 are checked before
export. VTT uses UTF-8, millisecond timestamps and at most two short lines per
cue. Upload the clean MP4 and attach its English VTT in Rise 360. Captions
remain optional for the learner rather than permanently embedded in the video.
`showCaptions: true` is for Studio review only; the final export rejects that
setting when sidecar captions are configured.
The CCI QA profile opts into PNG source frames and BT.709 encoding to preserve
the warm paper/pastel colours in browser MP4 playback; legacy render settings
are unchanged.

Review text, timing and motion in the full MP4, not only still frames.
The refined Slide 1 prototype is **human visually approved** as recorded above
and in its QA report. New or changed exports still require their own technical
QA and human review. The temporary narration/captions are not represented as
medically approved.
