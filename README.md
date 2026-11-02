# RETProgram Motion Graphics

A reusable 2D motion graphics system for professional Research Education and
Training Program (RETProgram) explainers in online health and medical research
training. It combines a Next.js preview app with Remotion compositions, shared
visual components, and a configurable theme.

Course-specific scripts, storyboards, narration, and captions must come from
approved source material. `RETProgramStyleProof` is a script-free brand opener;
`RETProgramInformedConsentProof` is the approved 18-second style proof, and
`RETProgramInformedConsent` is the 30-second course sequence. Caption timings
remain provisional because no narration recording has been provided.

## Project structure

- `AGENTS.md` — persistent AI production brief and repository instructions.
- `prompts/` — reusable prompts for storyboard, animation, narration sync, and
  quality review.
- `src/Root.tsx` — explicit composition registrations grouped by course.
- `src/courses/{course-slug}/{video-slug}/` — video-owned compositions, scenes,
  configuration, narration script, and storyboard.
- `src/shared/` — reusable components, captions, themes, and utilities.
- `src/remotion/` — stable CLI entry, bundler override, and compatibility exports.
  Add new implementations under `src/courses/`, not here.
- `src/app/` and `src/components/` — Next.js preview and rendering interface.
- `types/` — shared composition and render request schemas.
- `public/courses/{course-slug}/{video-slug}/` — dedicated source-media namespace
  for each video; `assets.md` records availability and provenance.
- `out/` — local render output (ignored by Git).
- `scripts/verify-production.mjs` — full-frame regression and MP4 checks.

### Current catalogue

| Course folder | Video package | Composition IDs |
|---|---|---|
| `cci-health-innovation` | `section-01-slide-01` | `CCIHealthInnovation-S01-Slide01` |
| `cci-health-innovation` | `section-01-slide-02` | `CCIHealthInnovation-S01-Slide02` (narration-led continuous production), `CCIHealthInnovation-S01-Slide02-Storyboard` (nine approved continuous states) |
| `good-clinical-practice` | `understanding-informed-consent` | `RETProgramInformedConsent`, `RETProgramInformedConsentProof` |
| `retprogram-brand` | `style-proof` | `RETProgramStyleProof` |
| `examples` | `my-comp`, `next-logo` | `MyComp`, `NextLogo` |

Proof and full informed-consent cuts intentionally share one package and media
namespace, with separate entry components, timing, and caption literals.
Brand and examples are organisational namespaces, not approved training courses.
All five legacy IDs, default formats, and compatibility imports are retained.

### CCI in Health Innovation - Slide 1 prototype

`CCIHealthInnovation-S01-Slide01` is the complete narration-led production
prototype for "One health problem, different perspectives." Its supplied
temporary recording measures **39.314250 seconds**; the composition is
**1180 frames / 39.333333 seconds** at 1920 x 1080, 30 fps. There is less than
one frame of rounding and no arbitrary 40-second duration or added silent tail.

Four relevant perspectives contribute different forms of knowledge and
expertise; the diagram does not assert equal relevance for every decision.
Lived experience receives restrained focus while all contributions remain.
Typography uses 14-frame, 10 px ease-out fade-ups. Opening lines stagger by
5 frames; the two payoff lines stagger by 6 frames. The refined final graphic
settles at 35.9 seconds and holds through the unchanged narration-led ending.

**Human visually approved on 2026-10-29**, including the refined typography
and reviewed static intervals. These are the current CCI typography-motion
standards, not changes to legacy RETProgram defaults. Preserve the intentional
final 3-4 second completed-message hold. Static holds may support comprehension;
do not add continuous or decorative ambient motion to clear static warnings.
For future CCI work, avoid unnecessarily long stagnant sections by using
meaningful narration-synchronised secondary reveals, connector drawing,
emphasis changes or information progression. Visual approval does not constitute
transcript, scientific-content or medical approval.

See the package's [storyboard and reuse guide](src/courses/cci-health-innovation/section-01-slide-01/storyboard.md),
[temporary transcript](src/courses/cci-health-innovation/section-01-slide-01/narration-script.md),
and [audio timing evidence](src/courses/cci-health-innovation/section-01-slide-01/audio-analysis.json).
Caption text/timing comes from local machine transcription and acoustic
analysis of the supplied audio; it still needs human transcript review.
The MP4 is **caption-free** by default (`showCaptions: false`). The validated
export writes matching `.vtt` closed captions and a plain `.txt` narration
transcript alongside the MP4. Upload the MP4 into Rise 360, then add the
matching WebVTT file using its closed-caption controls and select English.
Captions can be enabled in Studio for review, but the final sidecar export
rejects burned-in captions. All three assets share the same filename stem.
The optional Studio overlay and exporter read one canonical
[caption JSON](public/courses/cci-health-innovation/section-01-slide-01/closed-captions.json);
edit that file rather than maintaining a second transcript/timing array.
The CCI QA profile uses PNG source frames and BT.709 video colour conversion
for faithful browser playback; legacy compositions retain their render settings.
The CCI theme/components retain this approved opt-in visual baseline; existing videos
and legacy theme defaults are unchanged. Slide 2's header-free, continuous-story
revision was approved on 2026-11-02; production remains subject to technical QA
and separate human video approval. Slides 3-7 are
not implemented.

```cmd
npm run remotion
npm run qa:video -- CCIHealthInnovation-S01-Slide01
npm run export:video -- CCIHealthInnovation-S01-Slide01 out\exports\CCIHealthInnovation-S01-Slide01.mp4
```

### CCI content-first layout (Slide 2 and future work)

Do not use the persistent course name, breadcrumb or top-right RETProgram
label. No top navigation/context band is reserved. Use a small in-content
eyebrow or a minimal footer only when needed; do not reintroduce a persistent
header unless explicitly requested.

The shared opt-in `cciContentLayout` in
[CCI tokens](src/shared/themes/cci.ts) starts the eyebrow at y=72 and main heading
at y=126, with supporting text at y=231. The revised Slide 2 storyboard uses
stable anchors and a vertically extended workspace to fit cumulative
contributions and the final voices path, retaining safe margins,
the palette and type hierarchy. Slide 2 omits the optional eyebrow, moves its
stable title to y=72 and support to y=177, and shares the approved scene surface
between storyboard and production. Do not restore an extra top band.
The legacy `CourseHeader` remains for approved Slide 1 only; that video's
appearance is intentionally unchanged.

### CCI Slide 2 narration-led production

The [Slide 2 proposal](src/courses/cci-health-innovation/section-01-slide-02/storyboard.md)
uses one evolving experience-to-contribution connection to distinguish having
relevant lived experience from an invited role in informing/shaping innovation.
Its nine approved key states use the CCI design system and a stable main title.
Separate experience/workspace anchors gain a dashed distinction, then a solid
invitation link. Four contributions accumulate; local expertise emphasis follows;
the final voices/stage extension holds through the narration ending. No summary
scene follows. Every beat records persistence, additions, attention and removals.
The
[working draft narration](src/courses/cci-health-innovation/section-01-slide-02/narration-script.md)
is preserved unchanged. The user approved the storyboard and authorized full
production after timing the supplied temporary narration. Native decoded audio
is **59.16734693877551 s**; production is **1776 frames / 59.2 s** at 30 fps.
See the [measured timing map](src/courses/cci-health-innovation/section-01-slide-02/timing-map.md)
and [audio evidence](src/courses/cci-health-innovation/section-01-slide-02/audio-analysis.json).
Unequal scene durations follow the spoken phrases; longer ideas have purposeful
secondary reveals and comprehension holds. Production reuses `ContributionStory`
without remounting its anchors. Contribution rows accumulate at frames 757,
825, 871 and 906; expertise focus starts at 968. The final voices state starts
at 1406 and remains through frame 1775; stage reveals follow frames 1530,
1574 and 1677, not equal divisions. Beat 9 retains a softer four-row list and
unchanged three-line expertise callout while the wider voice-marker pathway takes
focus. The question stays in place; the latest refinement lowers only the speech
bubbles another 12 px and shortens their leaders for 34 px clear space below the
question's line box. The pathway and evenly spaced nodes stay fixed, and the
32 px stage labels remain inside the bottom safe area. Full-opacity dark-teal
strokes are retained; compression legibility must be checked during production QA.
Slide 1 remains unchanged.

```cmd
npm run qa:video -- CCIHealthInnovation-S01-Slide02
```

Review `out/storyboards/CCIHealthInnovation-S01-Slide02/storyboard.png` and
`storyboard.md`, or select `CCIHealthInnovation-S01-Slide02-Storyboard` in
Studio. Approval and production start were recorded following the user's
explicit decision on 2026-11-02, including the authorized final minor label/list
refinements. **Production is now paused for human storyboard re-approval** of the
latest spacing and three-line callout continuity correction. Do not run full-motion
QA or resume animation until the user approves that revised storyboard.
Original artifacts are retained
under `out/slide02-continuity-review/previous-storyboard/`.
Do not regenerate approved storyboard outputs during motion work: they are
hash-bound review evidence. Full-motion QA runs before human video approval.
Production has clean video and canonical sidecar caption JSON.
Review `.vtt` and `.txt` files are under
`out/captions/CCIHealthInnovation-S01-Slide02/`; QA renders its review MP4 under
`out/qa/CCIHealthInnovation-S01-Slide02/`. Local machine transcription and
acoustic timings require human transcript review; the recorded closing phrase
differs from the preserved draft. Successful QA is not human video approval.
After production implementation/QA, stop for **Awaiting human video approval**; do not
invoke `qa:approve` or final export without that explicit review.

## Installation

Use the Node.js version supported by the installed Next.js and Remotion
dependencies, then install the locked dependencies from the repository root:

```cmd
npm ci
```

Install the Playwright Chromium browser once after installing dependencies:

```cmd
npx playwright install chromium
```

## Commands

Start the Next.js preview app:

```
npm run dev
```

Open Remotion Studio and select `RETProgramStyleProof`,
`RETProgramInformedConsentProof`, or `RETProgramInformedConsent`:

```
npm run remotion
```

Render the 18-second proof of style as an H.264 MP4:

```
npm run render:retprogram
```

The output is `out/retprogram-style-proof.mp4`. Render another registered
composition with the Remotion CLI:

```cmd
npm run render -- COMPOSITION_ID out\filename.mp4 --codec=h264
```

Render the 18-second informed-consent proof as an H.264 MP4:

```cmd
npx remotion render RETProgramInformedConsentProof out\informed-consent-proof.mp4 --codec=h264
```

Render the 30-second informed-consent sequence as an H.264 MP4:

```cmd
npx remotion render RETProgramInformedConsent out\informed-consent.mp4 --codec=h264
```

To check composition names, frame rates, dimensions, and durations:

```cmd
npx remotion compositions
```

## Automated video quality assurance

For new videos, complete the [storyboard approval stage](#storyboard-approval-stage)
before full-motion QA. The existing six registrations retain their current
workflow; Section 1 Slide 1 is not changed or retroactively reapproved.

Playwright checks the Remotion Studio preview and assembles labelled contact
sheets locally. Remotion's bundled FFmpeg and FFprobe inspect rendered video,
so a separate system or npm FFmpeg install is not required. After `npm ci`,
install Playwright's Chromium browser once:

```cmd
npx playwright install chromium
```

All commands accept any registered composition ID:

```cmd
npm run qa:composition -- RETProgramInformedConsent
npm run qa:preview -- RETProgramInformedConsent
npm run qa:check -- RETProgramInformedConsent
npm run qa:report -- RETProgramInformedConsent
npm run qa:video -- RETProgramInformedConsent
npm run export:video -- RETProgramInformedConsent out\exports\RETProgramInformedConsent.mp4
```

`qa:video` runs the Studio browser check, renders a preview MP4 and deterministic
Remotion frames, creates a contact sheet, runs FFprobe/FFmpeg checks, and writes
JSON and Markdown reports under `out\qa\<CompositionId>\<run-id>\`. Separate
commands are available for the browser test, preview render, checks, and report.
`qa:check` and `qa:report` use the latest run by default; pass a run-directory
argument after the composition ID to select an earlier run.

The browser check detects page exceptions, failed requests, and visible text
outside the composition preview. Representative frames include the first and
last frames plus the frames immediately before, at, and after each configured
scene boundary. Boundaries are derived from `sceneDurations`; exceptional
offsets are declared in `scripts/qa-profiles.json`.

FFprobe verifies the video stream, H.264 codec, dimensions, frame rate, expected
duration, optional audio codec, and audio/video duration alignment. Bundled
FFmpeg decodes **every** video frame to 160 x 90 RGB for black/static screening,
and runs its silence detector when audio exists. This avoids optional `tile`,
`blackdetect` and `freezedetect` filters absent from the bundled Windows build.
Black screening requires at least 98% of thumbnail pixels below the configured
luminance threshold; static screening uses anchored mean RGB differences at the
configured dB threshold. These are thumbnail screening measurements, not
pixel-exact equivalents of FFmpeg's optional filters or subjective visual
approval. The report records the method explicitly. Synthetic threshold tests
run with `node --test scripts\video-qa-media.test.mjs`.
Intentional holds and pauses can be allow-listed in
the QA profile. Freeze and silence detections remain review warnings because
static scenes and pauses may be intentional; they are not automatically treated
as defects. No narration is currently supplied for the informed-consent video,
so its audio checks report “not applicable.”

Each report includes course/video identity, render specifications, check
results, findings and likely sources, correction history, the Studio screenshot,
sampled frames, and contact sheet. A successful technical run remains
**Awaiting human visual approval**. Review the contact sheet and boundary frames
for typography, clipping, spacing, hierarchy, alignment, colour, transitions,
motion, and design-system compliance before recording approval:

```cmd
npm run qa:approve -- RETProgramInformedConsent out\qa\RETProgramInformedConsent\<run-id> "Reviewer name" "Review notes"
```

For a confirmed issue, record each narrow correction and its result. The system
enforces a maximum of three recorded attempts per issue; unresolved issues
require human review:

```cmd
npm run qa:correction -- RETProgramInformedConsent video.freeze-001 "Likely cause" "Change summary" "Result"
```

The report statuses distinguish technical failure, technical completion, and
pending human visual approval. Technical checks cannot establish subjective
visual quality or caption-to-narration accuracy.

## RETProgram motion system

The `RETProgramStyleProof` composition is a script-free 18-second brand opener at
1920×1080 and 30 fps. It is a proof of visual style, not a course explainer:
the scene visuals use only the program name and the terms Research, Education,
and Training.

### Style guide

- **Palette:** paper `#F6F4EE`, ink `#18313D`, teal `#3E827B`, ochre `#C59A4A`,
  coral `#C97863`, rule `#D7D5CE`, and surface `#FFFEFA`.
- **Typography:** Inter with a restrained editorial hierarchy, generous
  spacing, and short labels.
- **Graphic language:** fine connected paths, outlined vector nodes, and sparse
  callouts. Motion is frame-driven and reveals meaningful relationships rather
  than moving elements decoratively.
- **Accessibility:** captions use the Remotion Basic Captions element with
  40px white text on a translucent dark field. Caption placement reserves the
  lower safe area; review caption legibility against every new background.

Palette and typeface settings live in
`src/shared/themes/retprogram.ts`; brand scene lengths and optional narration
are described in `src/courses/retprogram-brand/style-proof/props.ts`.
Each video's `video.config.ts` owns FPS, dimensions, default duration, and
public-relative media base path. Scene duration props determine actual runtime
through `calculateMetadata`. Editable defaults remain inline in `src/Root.tsx`
so Studio can write them back.

### Proof-of-style storyboard

| Beat             | Default duration | Visual                                                                         |
| ---------------- | ---------------: | ------------------------------------------------------------------------------ |
| Brand opening    |        3 seconds | RETProgram title and full program name resolve from a fine editorial mark.     |
| System formation |        4 seconds | Three simple vector symbols form along a single continuous connector.          |
| Connected system |        8 seconds | The connected nodes resolve into the labels Research, Education, and Training. |
| Brand resolution |        3 seconds | The diagram gives way to a clean RETProgram lockup and a final hold.           |

These are style beats, not a proposed scientific narrative. For a course video,
create a course-specific storyboard only after receiving the approved script
and narration. Keep scene changes aligned to spoken phrases and pauses.

The table above records the original conceptual storyboard, not the current
source timeline. The preserved brand implementation has an initial background
hold, opening at frame 120, network at frame 210, and closing at frame 450.
See its [source-accurate storyboard](src/courses/retprogram-brand/style-proof/storyboard.md).
The migration does not repair or redesign this existing timeline.

### Informed-consent course proof

The 18-second `RETProgramInformedConsentProof` composition is a proof cut of the
first two beats from the approved informed-consent storyboard:

| Beat             | Default duration | Visual                                                                      |
| ---------------- | ---------------: | --------------------------------------------------------------------------- |
| Understanding    |        6 seconds | An uncompleted trial document resolves into an understanding symbol.        |
| Communication    |       12 seconds | Two restrained researcher/participant forms connect to the five script topics. |

The approved 30-second `RETProgramInformedConsent` composition extends the proof
with the voluntary-choice and conclusion beats:

| Beat             | Default duration | Visual                                                                      |
| ---------------- | ---------------: | --------------------------------------------------------------------------- |
| Understanding    |        6 seconds | An uncompleted trial document resolves into an understanding symbol.        |
| Communication    |        9 seconds | A researcher and participant connect through the five script topics.        |
| Voluntary choice |        9 seconds | Equal Participate and Decline routes include an exit from participation.    |
| Conclusion       |        6 seconds | Understanding, Rights, and Choice resolve into a connected final composition. |

These are provisional scene timings based on the approved storyboard, not
audio-verified timing. Once narration is available, adjust the configurable
scene durations to spoken phrases and pauses. The proof and full sequence use
script-based caption drafts until the narration is recorded and verified.

Select `RETProgramInformedConsentProof` or `RETProgramInformedConsent` in Studio.
Both compositions have editable scene durations in frames and an optional
`narrationSrc` path relative to `public/`.

### Reuse for another course

Never replace an existing video's beats or script to create another course.
Create a new video package using the procedure below.

1. Put approved script/storyboard documents in the new source package and
   approved narration under its matching public-media namespace.
2. Set the new video's `narrationSrc` to its public-relative URL and adjust
   its `sceneDurations` in frames. Keep absent narration as an empty string.
3. Implement new named scenes driven by the approved script.
   Keep each scene responsible for one concept and preserve scientific
   terminology from the source.
4. Add each scene’s transcript as a `Caption[]` literal to its
   `<BasicCaptions>` instance. Use the Remotion caption format in milliseconds,
   keep the caption node inside its scene sequence, and verify its timing
   against the narration.
5. Apply video-specific theme overrides rather than scattering color and
   typography values through scene components. Reuse the `Icon`, `Label`,
   `Connector`, `Callout`, `TitleCard`, and `SceneTransition`
   components from `src/shared/components/`. The brand-specific `Diagram`
   stays in its own package; build course-specific diagrams from shared primitives.
6. Preview the composition in Remotion Studio, then inspect representative
   rendered frames for text clipping, diagram spacing, contrast, and safe
   margins before exporting.

### Adding a course and video

1. Choose stable lowercase kebab-case slugs, for example course
   `research-methods` and video `understanding-randomisation`. Check existing
   folders first. Do not copy another video's medical content, captions, or
   narration into the new package.
2. Create `src/courses/research-methods/understanding-randomisation/` with
   `Video.tsx`, `video.config.ts`, `props.ts`, `narration-script.md`,
   `storyboard.md`, and `scenes/`. Adding the first video establishes its
   course folder; no global course registry is needed.
3. Create the matching
   `public/courses/research-methods/understanding-randomisation/` directory.
   Add `assets.md` and media subdirectories (`audio/`, `images/`, `video/`,
   `captions/`) when required. Record licenses, approval status, and absent
   assets. Do not fabricate narration or silent production substitutes.
4. Propose visual direction, storyboard, source wording, educator-supplied
   learning objectives, timing assumptions, and technical structure. Wait for
   approval, then build a 15-20-second proof before the full sequence. Label
   missing source/audio and provisional timing explicitly.
5. In `video.config.ts`, define a globally unique composition ID, `fps`, `width`,
   `height`, default `durationInFrames`, and `mediaBasePath`. For new educational
   work use 1920x1080 at 30 fps. Use Zod props for positive integer scene
   durations and derive runtime from their sum, following the existing course.
   Keep editable registration defaults and schema defaults consistent.
6. Register an explicit `<Composition id="ResearchMethodsRandomisation" ... />`
   inside `<Folder name="research-methods">` in `src/Root.tsx`. Keep the ID a
   string literal, defaults inline, schema attached, and `calculateMetadata`
   deriving the duration. Use the config's FPS/dimensions. Slugs and Folder
   names use letters, numbers, and hyphens; IDs are globally unique and stable.
   Existing IDs must not be renamed.
7. Reuse shared components and theme types. Keep scene copy and content-specific
   diagrams local. Shared code must never import a course. New theme overrides
   are video-specific; do not change defaults to style a new course.
8. Use public-relative URLs with `staticFile()`, not Windows filesystem paths.
   For example, `videoMediaPath(config, "audio/narration.wav")` from
   `src/shared/utilities/media.ts` produces a URL beneath `config.mediaBasePath`.
   Set that as the video's `narrationSrc`; the video calls `staticFile()` when
   rendering Audio. URL paths use forward slashes; terminal filesystem paths
   use CMD backslashes. Do not set narrationSrc until the file exists.
9. Synchronise scenes and scene-local caption literals with actual approved
   audio, then run QA and export into root `out/`. FPS is configurable, but
   changing it does not automatically rescale frame-authored motion or
   millisecond captions; retime and validate deliberately.

The Next.js app and Lambda render form retain their legacy `MyComp` interface.
Use Studio for the multi-course catalogue. This migration does not introduce
a course selector or broaden the web render API's props schema.

Run `npm run remotion` to open Studio and select `RETProgramStyleProof`.
`npm run render:retprogram` writes the MP4 to `out/retprogram-style-proof.mp4`.

Reusable task templates are available in `prompts/`:

- `storyboarding.prompt.md`
- `animation-design.prompt.md`
- `narration-synchronization.prompt.md`
- `quality-review.prompt.md`

## Production and validation

For a new course, first generate the visual storyboard described below and
STOP for human storyboard approval. Only after explicit approval, build a
15–20-second proof before extending it into a full video. Preview it in Studio and render
representative frames to check clipping, spacing, contrast, caption placement,
and transitions. Do not claim final narration synchronization until the actual
approved audio is available.

### Storyboard approval stage

**CONTENT + NARRATION -> STORYBOARD -> HUMAN STORYBOARD APPROVAL ->
FULL MOTION IMPLEMENTATION -> QA -> HUMAN VIDEO APPROVAL -> FINAL OUTPUT**

Read the supplied content/narration, identify narrative beats, and develop a
visual metaphor and progression using the course design system. Author about
6-10 representative visual states. Select meaningful changes of understanding
or composition, not evenly spaced timestamps from an already-animated video.
Each state establishes objects, typography, hierarchy, approximate layout,
colour, relationships and narrative progression. Describe intended transitions;
finished motion curves, micro-animation, connector drawing, entrance motion,
audio synchronization, full QA and an MP4 are deliberately out of scope.

For each **new** video, add `storyboard.config.json` beside `video.config.ts`.
This illustrative shape shows one beat; supply the actual approved-source cues
and approximately 6-10 meaningful beats for your video (other counts are allowed
when the concept warrants them):

```json
{
  "compositionId": "Course-Video",
  "storyboardCompositionId": "Course-Video-Storyboard",
  "concept": "Describe the proposed visual metaphor and narrative progression.",
  "framesPerBeat": 60,
  "beats": [
    {
      "name": "Opening concept",
      "narrationCue": "Relevant supplied narration phrase or meaning.",
      "visual": "Describe composition, objects, text, hierarchy, layout and colour.",
      "purpose": "What this visual communicates.",
      "transitionIntention": "How the relationships evolve into the next state.",
      "persists": "The title, existing anchors and their established relationship.",
      "addsOrChanges": "One new example within the existing diagram.",
      "attentionTarget": "The newly added example.",
      "removes": []
    }
  ]
}
```

`framesPerBeat` is only a convenient Studio inspection hold, **not an exact
narration time**. No narration timestamps are inferred. Keep source script and
the authored `storyboard.md` in the video package; the command generates a
review copy from the manifest, not a replacement for approved course content.
Missing or provisional content/narration must be labelled honestly.

**A storyboard beat represents a change from the previous visual state, not a
new slide.** Every beat documents **Persists**, **Adds or changes**,
**Attention target**, and **Removes**. The manifest requires these fields;
`removes` is `[]` for none, otherwise an array of
`{ "element": "...", "reason": "..." }`. Each removal requires a reason.

Keep one main title for one teaching concept unless a genuine topic/scene
change warrants another. Keep conceptual components mounted and anchored,
accumulate enumerated ideas where screen space permits, and avoid changing
title, layout and major object simultaneously. Transitions explain conceptual
relationships. Finish on an established state rather than a redundant summary.
Do not repeat a top banner/eyebrow across beats unless it adds essential learning
value; prioritize that space for the explainer diagram. Slide 2 retains its
teaching title without an additional top eyebrow.

**Cumulative continuity does not require every persistent element to remain at
equal visual emphasis. When attention moves to a new concept, previously
established elements may remain visible but reduce in prominence.**

**When a final beat introduces a new conceptual layer, reduce visual density
elsewhere rather than continuously adding equally prominent information.**

**When a persistent component carries established information across consecutive
beats, do not alter its wording, internal structure or content merely to
accommodate a new beat. Attention may shift through opacity, contrast or emphasis,
but the established component itself should remain semantically and visually
consistent unless the storyboard explicitly calls for a content change.**

### Continuity and cognitive-load approval checklist

Follow the [13 production rules](./AGENTS.md#storyboard-continuity-and-cognitive-load-review).
Assess the storyboard as one evolving sequence, not only individual stills:

- [ ] One stable main title per teaching clip, except genuine topic/scene changes.
- [ ] Every beat documents Persists, Adds or changes, Attention target and
      justified Removes.
- [ ] Persistent objects retain wording, meaning, internal layout and animation
      continuity; no unnecessary exits/re-entries or resets.
- [ ] Transitions explain relationships rather than decorate beat boundaries.
- [ ] Related enumerated ideas accumulate where space permits.
- [ ] Established context remains visible with restrained reductions in emphasis
      when attention shifts; removal requires explicit storyboard intent.
- [ ] New conceptual layers reduce density elsewhere and have a clear attention
      target instead of filling leftover space.
- [ ] Every beat has readable type, safe-area clearance, clear title/content and
      heading/diagram spacing, and balanced horizontal/vertical use.
- [ ] Removing non-essential headers improves the visual's scale, spacing,
      readability or hierarchy, not just its vertical position.
- [ ] One major attention change at a time; no simultaneous title/layout/object/
      large-text reset.
- [ ] Each beat logically grows from the previous one; learners can identify what
      stays the same and understand the cumulative information.
- [ ] The final state resolves the idea, stays readable and holds for comprehension
      without redundant summary content.
- [ ] A human explicitly approves title strategy, continuity, cumulative behaviour,
      transitions, hierarchy, spacing, cognitive load and final-state clarity
      before detailed motion, narration synchronization or final rendering.

This checklist is a human review aid, not an automatic approval mechanism.
Static layout inspection and narration-cue identification can inform a storyboard;
they do not authorize detailed animation or claim final synchronization.

For continuous stories, create a package-local `Storyboard.tsx` with one mounted
scene whose state changes across inspection slots:

```tsx
import { useCurrentFrame } from "remotion";
import manifest from "./storyboard.config.json";
import { ConceptScene } from "./scenes/ConceptScene";

const poses = ["opening", "relationship", "contribution"] as const;
export const VideoStoryboard = () => {
  const frame = useCurrentFrame();
  const pose = poses[Math.floor(frame / manifest.framesPerBeat)];
  if (!pose) throw new Error("Missing storyboard pose.");
  return <ConceptScene pose={pose} />;
};
```

Expand `poses` to match the manifest's beat order/count. `ConceptScene` is
illustrative, not a supplied component: use the **same local scene components,
props and shared theme tokens** intended for production, with explicit settled
poses instead of implementing animation just to obtain a still. Do not key the
scene by beat or conditionally swap its persistent anchors.
The opt-in shared `src/shared/storyboard/Storyboard.tsx` helper remains available
for genuinely independent scenes or legacy `Sequence`/`Freeze` inspection; it is
not a reason to remount one continuing conceptual object at every beat.

Register both entries explicitly inside the course `Folder` in `src/Root.tsx`.
Keep the production entry minimal until approval. For the storyboard:

```tsx
<Composition
  id="Course-Video-Storyboard"
  component={VideoStoryboard}
  durationInFrames={manifest.beats.length * manifest.framesPerBeat}
  fps={30}
  width={1920}
  height={1080}
/>
```

Use the production video's configured FPS/dimensions for both entries; the
exporter verifies their match and the storyboard duration. Open Studio and
inspect each hold for layout, clipping, hierarchy, legibility, safe margins
and colour. Storyboard still review is not full-motion QA or visual approval.

```cmd
npm run remotion
npm run storyboard -- Course-Video
```

This bundles the project and renders **one PNG per beat only**, never the
complete production animation:

```text
out/storyboards/Course-Video/
  storyboard.png
  beat-01.png
  beat-02.png
  ...
  storyboard.md
```

The contact sheet labels each beat. Each Markdown entry includes **Narration
cue**, **Visual**, **Purpose**, and **Transition intention**. Old surplus PNGs
are not deleted on regeneration; only the current manifest's beats appear in
the new contact sheet, Markdown and approval hash.

After generation, **STOP** and report the storyboard composition ID,
contact-sheet and Markdown locations, beat count, and a brief visual concept:

**Awaiting human storyboard approval.**

Generation does not authorize full animation. Do not invent a reviewer or
approve on the user's behalf. Only after an explicit human decision:

```cmd
npm run storyboard -- Course-Video approve "Human reviewer" "Explicit approval and scope"
npm run storyboard -- Course-Video start
```

The package-local, tracked `production-status.json` records:

| State | Meaning |
|---|---|
| `draft` | Not generated, or generation incomplete/failed |
| `awaiting-storyboard-approval` | PNGs/contact sheet/Markdown ready; STOP |
| `storyboard-approved` | Explicit human approval of the generated revision |
| `in-production` | Approved full motion may be implemented |
| `awaiting-video-approval` | Full QA passed; STOP for human video review |
| `approved` | Human approved the QA-reviewed video revision |

Approval includes a hash of the manifest and generated review artifacts.
Regeneration always invalidates earlier storyboard **and video** approval,
including on failure. Preserve review artifacts while producing that revision;
if absent or edited, regenerate and request approval again. Concept, metaphor,
sequence or substantial layout changes always require a fresh storyboard.
Production implementation can add motion without changing the approved states.
These are local workflow safeguards, not authentication or a substitute for
human judgment. Do not bypass them with raw CLI/Studio renders or manual
status edits. `npm run render` directs new videos to the gated QA/export path;
legacy render commands remain compatible.
The legacy Lambda render API also rejects new composition IDs: it cannot
verify that a deployed bundle matches a locally approved video. It retains
existing-ID behavior; use the local approval/export workflow for new videos.

After approved motion implementation:

```cmd
npm run qa:video -- Course-Video
npm run qa:approve -- Course-Video out\qa\Course-Video\RUN-ID "Human reviewer" "Explicit video approval notes"
npm run export:video -- Course-Video out\exports\Course-Video.mp4
```

`qa:preview` and `qa:video` require storyboard approval and a recorded
production start. Successful `qa:video` requests **human video approval**; it
does not export. `export:video` for new videos rechecks the approved QA render
and copies that exact MP4, rather than silently rendering a different revision.
Source/media or reviewed MP4 changes require QA and human video approval again.
The source fingerprint conservatively covers all `src/` and `public/` files,
except approval records; unrelated source edits may also require fresh QA.
Existing caption/stream checks and sidecar rules still apply.

Trivial changes to an already-approved animation, or **explicitly requested**
reuse without conceptual changes, need not repeat storyboard approval. Record
the instruction/scope in the package storyboard and retain its existing
approval. Video QA and video approval still apply. New teaching concepts,
metaphors, sequences or substantially different layouts are not exceptions.
Legacy compositions keep their established workflow; never add a new ID to
the grandfathered list to skip approval.

Workflow tests (including actual PNG generation using an isolated test
composition, not new course content):

```cmd
npm run test:storyboard
```

Typical code checks:

```cmd
npm run typecheck
npm run lint
npm run build
npx remotion compositions
npm run qa:video -- RETProgramInformedConsent
```

For structural or shared-code changes, capture a baseline **before editing**,
then verify afterward, using the same machine/browser/fonts and props:

```cmd
npm run qa:baseline
npm run qa:verify
```

These commands use `out\migration-qa` by default. Baseline capture renders every
frame of every composition as PNG, stores SHA-256 fingerprints and representative
frames, and records default metadata/props. Verification requires identical
metadata and PNG bytes for all frames, then exports each composition to MP4.
It refuses to overwrite a baseline or an existing MP4. For a subsequent change,
choose a fresh output directory for both commands:

```cmd
npm run qa:baseline -- out\qa-next-change
npm run qa:verify -- out\qa-next-change
```

Comparisons intentionally fail if the catalogue or approved visuals change;
review those changes explicitly rather than automatically accepting a new
baseline. Inspect Studio playback and representative frames too: equality proves
preservation, not medical correctness or the absence of pre-existing defects.
Installed skill examples are excluded from project linting.

Generated media belongs in ignored `out/`, `renders/`, or `build/` directories.
Source MP4s/audio under `public/courses/` remain trackable; there is no blanket
media-extension ignore. Existing assets and outputs are not deleted.

Keep medical and research statements faithful to the approved source. When a
script is ambiguous or a visual could overstate the evidence, pause and request
clarification rather than making an unsupported assumption.

The following script will set up your Remotion Bundle and Lambda function on AWS:

```
node deploy.mjs
```

You should run this script after:

- changing the video template
- changing `config.mjs`
- upgrading Remotion to a newer version

## Set up rendering on AWS Lambda

This template supports rendering the videos via [Remotion Lambda](https://remotion.dev/lambda).

1. Copy the `.env.example` file to `.env` and fill in the values.
   Complete the [Lambda setup guide](https://www.remotion.dev/docs/lambda/setup) to get your AWS credentials.

1. Edit the `config.mjs` file to your desired Lambda settings.

1. Run `node deploy.mjs` to deploy your Lambda function and Remotion Bundle.

## Docs

Get started with Remotion by reading the [fundamentals page](https://www.remotion.dev/docs/the-fundamentals).

## Help

We provide help on our [Discord server](https://remotion.dev/discord).

## Issues

Found an issue with Remotion? [File an issue here](https://remotion.dev/issue).

## License

Note that for some entities a company license is needed. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
