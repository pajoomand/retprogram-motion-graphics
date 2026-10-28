# RETProgram Motion Graphics

A reusable 2D motion graphics system for professional Research Education and
Training Program (RETProgram) explainers in online health and medical research
training. It combines a Next.js preview app with Remotion compositions, shared
visual components, and a configurable theme.

Course-specific scripts, storyboards, narration, and captions must come from
approved source material. The current proof of style is a script-free brand
opener, not a medical or scientific explainer.

## Project structure

- `AGENTS.md` — persistent AI production brief and repository instructions.
- `prompts/` — reusable prompts for storyboard, animation, narration sync, and
  quality review.
- `src/remotion/Root.tsx` — registered Remotion compositions.
- `src/remotion/RETProgram/` — proof composition, timing/theme props, and shared
  RETProgram motion components.
- `src/app/` and `src/components/` — Next.js preview and rendering interface.
- `types/` — shared composition and render request schemas.
- `public/` — location for narration and other local media assets.
- `out/` — local render output (ignored by Git).

## Installation

Use the Node.js version supported by the installed Next.js and Remotion
dependencies, then install the locked dependencies from the repository root:

```bash
npm ci
```

## Commands

Start the Next.js preview app:

```
npm run dev
```

Open Remotion Studio and select `RETProgramStyleProof`:

```
npm run remotion
```

Render the 18-second proof of style as an H.264 MP4:

```
npm run render:retprogram
```

The output is `out/retprogram-style-proof.mp4`. Render another registered
composition with the Remotion CLI:

```bash
npx remotion render <CompositionId> out/<filename>.mp4 --codec=h264
```

To check composition names, frame rates, dimensions, and durations:

```bash
npx remotion compositions
```

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
  white text on a translucent dark field. Caption placement reserves the lower
  safe area; review caption legibility against every new background.

Palette and typeface settings live in
`src/remotion/RETProgram/theme.ts`; scene lengths and the optional narration
asset are composition props in `src/remotion/RETProgram/props.ts`.

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

### Reuse for another course

1. Add the approved script excerpt and narration file under `public/`.
2. Set `narrationSrc` to the file path relative to `public/` and adjust
   `sceneDurations` in frames (30 frames per second). The composition duration
   updates from those values.
3. Replace the proof beats with named scenes driven by the approved script.
   Keep each scene responsible for one concept and preserve scientific
   terminology from the source.
4. Add each scene’s transcript as a `Caption[]` literal to its
   `<BasicCaptions>` instance. Use the Remotion caption format in milliseconds,
   keep the caption node inside its scene sequence, and verify its timing
   against the narration.
5. Customize the shared theme tokens rather than scattering color and
   typography values through scene components. Reuse the `Icon`, `Label`,
   `Connector`, `Diagram`, `Callout`, `TitleCard`, and `SceneTransition`
   components from `src/remotion/RETProgram/components/`.
6. Preview the composition in Remotion Studio, then inspect representative
   rendered frames for text clipping, diagram spacing, contrast, and safe
   margins before exporting.

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

```bash
npx tsc --noEmit
npm run lint
npx remotion compositions
```

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
