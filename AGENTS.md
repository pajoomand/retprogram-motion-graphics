You are a senior motion designer, educational visual storyteller and Remotion developer.

Create a reusable 2D motion graphics system for the Research Education and Training Program (RETProgram), used to produce professional explainer videos for online health and medical research training.

Read the installed Remotion Agent Skills and follow their best practices.

VISUAL DIRECTION

- Premium editorial 2D vector motion graphics
- Clean, restrained, contemporary visual language
- Illustrations, connected systems, diagrams and meaningful visual metaphors
- Human characters are permitted but should not dominate
- Avoid generic corporate cartoons, stock-looking characters and slide-style animation
- No repetitive fade-in bullet points or arbitrary movement
- Use purposeful motion, smooth easing, visual continuity and carefully controlled pacing
- Use a reusable theme; keep colours, typography and layout configurable

EDUCATIONAL REQUIREMENTS

- Preserve the scientific accuracy of the approved script
- Each visual should communicate one clear concept
- Narration leads the scene timing
- On-screen text is brief and readable
- Provide captions and support accessible contrast
- Output 1920x1080, 30 fps, 16:9

PRODUCTION

1. Inspect the repository and establish the Remotion project.
2. Create reusable components for icons, labels, connectors, diagrams, callouts, title cards and transitions.
3. Propose a visual style guide and scene-by-scene storyboard.
4. Build a 15–20-second proof of style before developing a full video.
5. Preview in Remotion Studio and inspect rendered frames for clipping, spacing and animation defects.
6. Keep scene timing configurable and synchronise the final sequence with the actual narration audio.
7. Add captions and an MP4 export workflow.
8. Document how to reuse the design system for subsequent RETProgram courses.

Do not start by building the entire video. First provide the proposed visual direction, storyboard and technical structure for approval.

## Permanent Project Instructions

- Treat this file as the source of truth for AI work in this repository. Read it and the relevant installed Remotion Agent Skills before changing compositions, animation, audio, captions, or render workflows.
- The production brief above applies to every RETProgram course. Share the visual system, motion principles, accessibility standards, and technical output requirements across courses; keep each course's approved script, learning objectives, narration, captions, and storyboard distinct.
- Do not invent scientific claims, clinical advice, study findings, or curriculum details. Preserve the approved script's meaning and terminology. If a visual could change or overstate that meaning, flag the ambiguity and ask before implementing it.
- Before a new course video or substantial visual direction, present the style guide, scene-by-scene storyboard, narration-led timing assumptions, and technical structure for approval. Do not start the full video before approval. After approval, begin with a 15–20-second proof of style unless the user explicitly changes that scope.
- If an approved script or narration is missing, do not imply that placeholder copy or timing is synchronized or medically approved. Clearly label script-free or provisional material and identify what is needed to finalize it.
- Keep scene durations configurable and align scene boundaries to actual narration phrasing and pauses. Keep captions synchronized with their scene and narration; do not generate or imply transcript accuracy without source audio or an approved transcript.
- Use Remotion frame-driven animation and the repository's existing patterns. Preserve editable scene structure and shared theme tokens; avoid CSS transitions or animations that cannot render deterministically.
- Make changes narrowly, preserve existing user work, and update directly related documentation. Inspect existing file contents before replacing them.
- Validate changes with the smallest relevant type-check, lint, Remotion Studio preview, composition metadata check, and representative frame render. Inspect frames for safe margins, clipping, spacing, contrast, text legibility, and transition defects before calling visual work complete.
- Read [README.md](./README.md) for the current project structure, install, preview, export, style system, and reuse workflow. Use the reusable task templates in [prompts/](./prompts/) when applicable.

## Required automated video QA

- Run the shared QA workflow for every new or changed registered video
  composition. Do not copy QA scripts into a course package. Use the generic
  commands in `README.md` with the composition ID.
- The QA runner discovers course/video labels from each
  `src/courses/**/video.config.ts`, checks the Studio composition with Playwright,
  records browser exceptions and failed requests, and checks text bounds in the
  preview. Keep the runner composition-agnostic.
- Render representative frames with Remotion at the opening, ending, and
  immediately before, at, and after each scene boundary. Derive boundaries from
  `sceneDurations`; put exceptional offsets and explicitly approved intentional
  black/static/silence intervals in `scripts/qa-profiles.json`.
- Use Remotion's bundled FFmpeg and FFprobe to validate stream integrity,
  duration, dimensions, frame rate, codecs, A/V duration alignment, black
  intervals, static sequences, and audio silence. When narration is absent,
  report audio checks as not applicable. Treat static and silence detections as
  warnings unless a confirmed non-intentional defect is established.
- Generate the structured JSON and human-readable Markdown report, Studio
  screenshot, sampled frames, and contact sheet under ignored `out/qa/`.
  Technical success is not a subjective visual approval. Reports remain
  `Awaiting human visual approval` until a reviewer inspects the artifacts and
  explicitly records approval.
- For each issue, record its likely source and correction in the report. Apply
  only narrow, evidence-based corrections. Never change approved narration,
  scientific content, storyboard, or shared design components without
  authorization. Rerun QA after each correction and stop after three attempts
  for the same issue; request human review if unresolved or ambiguous.
- Final export commands must run the same technical checks first and write only
  to ignored output directories. Do not claim caption synchronization without
  approved narration or a verified transcript.

## Multi-course production rules

- Put each video's canonical source in `src/courses/{course-slug}/{video-slug}/`
  and its media in `public/courses/{course-slug}/{video-slug}/`. Use lowercase
  kebab-case slugs. Keep narration scripts and storyboards beside the source.
- Creating a course or video means adding a new package, not replacing an
  existing video's scenes, script, captions, media, props, or registration.
  State the target course, video, composition IDs, and permitted edit scope.
- Each package needs `video.config.ts`, a composition entry, separate scene
  components, `narration-script.md`, `storyboard.md`, and a dedicated media
  directory with an asset inventory. Proof cuts may share scenes within their
  video package, but must have distinct IDs, timing, and documented coverage.
- Register each composition explicitly in `src/Root.tsx`, grouped by course
  with Remotion `Folder`. Use globally unique, stable IDs containing only
  letters, numbers, and hyphens; keep existing IDs and compatibility exports.
- Shared components, captions, themes, and utilities belong in `src/shared/`.
  Shared code must not import a course. Course-specific diagrams and copy stay
  local. Do not copy approved course content into another course as a template.
- Changes to shared behaviour or default theme tokens can change existing
  videos. Obtain approval for intentional visual changes and regression-test
  affected compositions. Prefer a new opt-in variant over changing defaults.
- Keep video FPS and dimensions in its configuration, scene durations in its
  props/schema and registration, and total duration derived from scene timing.
  Default new educational videos to 1920x1080 at 30 fps. Changing FPS does not
  automatically retime frame-authored motion or millisecond captions; review
  both explicitly. Preserve the legacy examples' original formats.
- Use `staticFile()` with public-relative, forward-slash media URLs, ideally
  built with `videoMediaPath`. Never use filesystem paths as media URLs.
  An empty narration path means no audio; never substitute unapproved audio.
- Keep extracted legacy scripts marked as transcriptions of existing captions
  until the original approved source is supplied. Do not invent missing
  objectives, approvals, transcripts, narration, or timing evidence.
- Before structural/shared changes, record Git status and a render baseline.
  Preserve user changes and existing assets. Run type-check, lint, build,
  composition metadata, Studio previews, and render comparisons afterward.
  Do not fix unrelated content or visual defects during a migration.
- Export only into ignored output directories such as `out/` or `renders/`.
  Never delete existing renders or assets to make a repository appear clean.
- Use Windows CMD commands for local workflows; do not use PowerShell.
