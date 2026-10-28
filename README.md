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
| `good-clinical-practice` | `understanding-informed-consent` | `RETProgramInformedConsent`, `RETProgramInformedConsentProof` |
| `retprogram-brand` | `style-proof` | `RETProgramStyleProof` |
| `examples` | `my-comp`, `next-logo` | `MyComp`, `NextLogo` |

Proof and full informed-consent cuts intentionally share one package and media
namespace, with separate entry components, timing, and caption literals.
Brand and examples are organisational namespaces, not approved training courses.
All five legacy IDs, default formats, and compatibility imports are retained.

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

Playwright checks the Remotion Studio preview. Remotion's bundled FFmpeg and
FFprobe inspect rendered video, so a separate system or npm FFmpeg install is
not required. After `npm ci`, install Playwright's Chromium browser once:

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
duration, optional audio codec, and audio/video duration alignment. FFmpeg
decodes the complete MP4 and detects black intervals, static sequences, and
silence when audio exists. Intentional holds and pauses can be allow-listed in
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

For a new course, first propose the visual direction, storyboard, timing
assumptions, and technical structure for approval. Build a 15–20-second proof
before extending it into a full video. Preview it in Studio and render
representative frames to check clipping, spacing, contrast, caption placement,
and transitions. Do not claim final narration synchronization until the actual
approved audio is available.

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
