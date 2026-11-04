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
3. Generate an approval-ready visual storyboard and STOP for explicit human storyboard approval.
4. Only after storyboard approval, build a 15–20-second proof of style before developing a full video.
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

## Mandatory storyboard approval gate

**A storyboard beat represents a change from the previous visual state, not a new slide.**

- Document **Persists**, **Adds or changes**, **Attention target** and
  **Removes** for every beat. In `storyboard.config.json`, use `persists`,
  `addsOrChanges`, `attentionTarget` and a `removes` array with `element` and
  `reason` for each removal; use `[]` when nothing is removed.
- Keep the main title stable throughout one teaching concept unless there is
  a genuine scene/topic change. Communicate local ideas within the diagram.
- Do not repeat a persistent top banner/eyebrow across beats unless it adds
  essential learning value. Reclaim that space for the main explainer diagram.
  Slide 2 has no additional top eyebrow; retain only its main teaching title.
- Persistent conceptual components must stay mounted and anchored, not repeatedly
  exit and re-enter. Evolve their state/content without keying the whole scene
  by beat. Reuse this same component structure in storyboard and production.
- Build enumerated ideas cumulatively where screen space permits.
- Supporting explanatory text may retire once its instructional purpose has
  been completed without violating component persistence, provided the core
  identity, meaning and visual anchor remain unchanged. Retire it only when
  narration clearly moves beyond the idea it supports, not merely to simplify
  a frame. Document the reason in `Removes` and use a restrained fade.
- When a persistent component carries established information across consecutive
  beats, do not alter its wording, internal structure or content merely to
  accommodate a new beat. Attention may shift through opacity, contrast or
  emphasis, but the established component itself should remain semantically
  and visually consistent unless the storyboard explicitly calls for a content change.
- Cumulative continuity does not require every persistent element to remain at
  equal visual emphasis. When attention moves to a new concept, previously
  established elements may remain visible but reduce in prominence.
- When a final beat introduces a new conceptual layer, reduce visual density
  elsewhere rather than continuously adding equally prominent information.
- Avoid changing the title, layout and major animated object simultaneously.
  Transitions communicate conceptual relationships, not decoration.
- Do not add a redundant final summary when narration can finish on an
  established visual state. Maintain comprehension holds without filler motion.

### Storyboard continuity and cognitive-load review

Apply these rules across RETProgram courses. Review the evolving sequence,
not just the quality of isolated stills.

**Do not optimise each storyboard frame independently. Optimise the learner's
experience across the full sequence.**

1. **Stable main title.** Within a single teaching clip, retain the title unless
   the topic or scene genuinely changes. Communicate narration sub-ideas within
   the visual system, not by replacing the largest heading for every beat.
2. **Beats are state changes, not slides.** Document `Persists`, `Adds or changes`,
   `Attention target` and `Removes` for each beat. Every removal needs an
   instructional or visual reason. Keep the same concept on screen across
   consecutive beats unless the storyboard explicitly requires otherwise.
3. **Preserve persistent components.** Keep the same visual object mounted.
   Do not unnecessarily change its wording, meaning or internal layout, reset
   its animation, or make it disappear and re-enter. Attention may shift through
   opacity, contrast, emphasis or scale; semantic and visual consistency remains
   required unless the storyboard explicitly calls for a change.
4. **Meaningful transitions.** Explain relationships: a broken link becomes
   solid, a connector draws towards a decision, an item joins an existing system,
   emphasis shifts between established objects, or a pathway progressively
   reveals. Never fade an unchanged object out and back in just for a new beat.
5. **Cumulative enumeration.** Progressively add related contributions, stages
   or options where space permits, retaining earlier items. For example,
   understand a need -> question an assumption -> consider options -> inform
   a decision builds one cumulative visual rather than replacing each item.
6. **Persistence is not equal prominence.** Use restrained opacity, contrast,
   scale or colour emphasis to guide attention while retaining established
   information. Do not remove it simply to make room without storyboard intent.
7. **Control information density.** A new conceptual layer must retain necessary
   context, soften already-understood information, create a clear attention
   target and preserve generous spacing. Do not squeeze new content into
   leftover space or keep adding equally prominent information.
8. **Hierarchy and spacing.** Review title-to-content and heading-to-diagram
   spacing, related/unrelated element spacing, safe-area clearance, readable
   text sizes, and balanced horizontal/vertical use in every beat. Separate a
   heading from the content below it; do not solve crowding by compressing
   headings, labels and diagrams together.
9. **Use reclaimed space intentionally.** Persistent headers, eyebrows and
   breadcrumbs need essential learning value. Removing them should enlarge the
   core visual, improve spacing/readability or simplify hierarchy, not merely
   move everything upward.
10. **One major attention change at a time.** Avoid simultaneous changes to the
    title, major layout, several objects and large text blocks. Let learners
    follow one major visual change alongside the narration wherever possible.
11. **Review sequence continuity.** Check whether learners know what stays the
    same, attention is guided, each beat grows logically from the previous one,
    persistent objects avoid unnecessary changes/disappearances, titles remain
    stable, cumulative information remains understandable, and the final state
    feels like a conclusion rather than squeezed-in extra content.
12. **Final-beat clarity.** Resolve the teaching idea on a readable established
    state, avoid unnecessary new content or a redundant summary, and hold long
    enough for learners to absorb the final message.
13. **Human approval gate.** Before detailed motion, narration synchronization
    or final rendering, human storyboard review must confirm the stable-title
    strategy, component continuity, cumulative behaviour, meaningful transitions,
    hierarchy, spacing, cognitive load and final-state clarity. A rule submission,
    generated PNGs or passing technical checks do not constitute approval.

For new explainer animations, the default workflow is:

CONTENT + NARRATION -> STORYBOARD -> HUMAN STORYBOARD APPROVAL ->
FULL MOTION IMPLEMENTATION -> QA -> HUMAN VIDEO APPROVAL -> FINAL OUTPUT.

- Read supplied content and narration; identify narrative beats, the visual
  metaphor, and visual progression. Use the established course design system.
  Never invent content approval or exact narration timestamps.
- Before detailed motion, author approximately 6-10 meaningful visual states,
  not evenly spaced samples of an already-built video. Establish composition,
  objects, typography, hierarchy, layout, colour, relationships, narrative
  progression, and transition intentions. Use the same scene components and
  tokens intended for production, with explicit static poses where necessary.
- Register `<ProductionId>-Storyboard` alongside each new production ID in
  `src/Root.tsx`. Keep both registrations explicit and course-grouped. The
  production entry can remain a minimal placeholder until approval.
- Add package-local `storyboard.config.json` following README. Run
  `npm run storyboard -- <ProductionId>` to render only key-state PNGs,
  a labelled contact sheet, and Markdown under
  `out/storyboards/<ProductionId>/`. Keep the authored source storyboard in
  the video package. Storyboard inspection holds are not narration timings.
- Finished micro-animation, easing, connector drawing, entrance motion,
  narration synchronization, full video QA, and MP4s are NOT prerequisites for
  storyboard approval. Inspect the Studio key states and PNGs for obvious
  layout/text defects; do not run the full-video QA pipeline at this stage.
- After generation, STOP. Report storyboard composition ID, contact-sheet
  and Markdown locations, beat count, and proposed visual concept. State
  **Awaiting human storyboard approval.** Generation success is never approval.
- Only an explicit human decision can authorize `approve`; never self-approve
  or invent a reviewer/approval note. Record the decision with
  `npm run storyboard -- <ProductionId> approve "reviewer" "decision notes"`.
  Then explicitly run `npm run storyboard -- <ProductionId> start` before
  full motion. The existing proof-of-style requirement still applies.
- The package's tracked `production-status.json` records `draft`,
  `awaiting-storyboard-approval`, `storyboard-approved`, `in-production`,
  `awaiting-video-approval`, or `approved`. Generated artifacts are ignored;
  preserve their hash-bound review evidence. Regeneration invalidates approvals,
  even if rendering fails. Changed concepts/layouts require regeneration and
  renewed human storyboard approval.
- After motion, `qa:video` requests human video approval; `qa:approve` records
  it only after an explicit human review. `export:video` rechecks and copies
  the exact approved QA video; changing source/media or the reviewed MP4
  requires QA and video approval again. Never bypass these gates with direct
  Remotion CLI, Studio rendering, or manually edited status JSON.
- A separate storyboard review is unnecessary for trivial changes to an
  already-approved animation, or explicitly instructed reuse of an approved
  animation without conceptual changes. Record the human instruction and
  scope in the package storyboard; retain its existing storyboard approval.
  New teaching concepts, metaphors, sequences or substantially different
  layouts always require a new storyboard review.
- Existing six compositions are grandfathered, not retroactively declared
  storyboard-approved. Do not extend the legacy allowlist for new work.
  Section 1 Slide 1 and its approved visuals, timing, media, registration,
  captions, and export behavior must remain unchanged.

## CCI Health Innovation content-first layout

- For Slide 2 and future CCI storyboards/productions, omit the persistent
  course name, section/page breadcrumb and top-right RETProgram label.
  Do not reserve a navigation/header band or reintroduce one unless explicitly
  requested. If context is necessary, use a small in-content eyebrow or minimal
  footer, not a replacement header.
- Use `cciContentLayout` in `src/shared/themes/cci.ts` for the header-free
  layout: eyebrow y=72, main heading y=126, support y=231 (summary y=212).
  Rebalance/enlarge diagrams into the reclaimed space; do not just hide the
  header while leaving its empty band. Preserve safe margins and clear hierarchy.
- Keep approved Slide 1 unchanged as a legacy composition. `CourseHeader` is
  retained for it, not a default template for new CCI work. Colours, type
  hierarchy, scientific meaning, narration and timing are not changed by this rule.
- The requested Slide 2 layout revision requires regenerated storyboard review.
  Retain earlier review artifacts as history; do not claim their QA/approval
  applies to the revised layout. Resume full-motion QA only after explicit
  approval of the revised storyboard.
- Slide 2's approved storyboard has nine continuous states: one fixed title,
  separate anchors, dashed-to-solid invitation, cumulative examples, local
  expertise emphasis and a final stage-specific voices extension. The old
  ten-beat prototype is no longer wired into production. The user approved
  the continuous structure and authorized full motion on 2026-11-02, including
  final Beat 9 refinements: 32 px stage labels and 60% contribution-list opacity.
  Storyboard and production reuse `ContributionStory`; never restore the recap
  or changing headings. Human video approval remains a separate required gate.
- The user approved the final Slide 2 storyboard on 2026-11-02 and explicitly
  requested clip production and a source push. Preserve the final 34 px
  question-to-icons clearance, unchanged upper composition, and identical full
  three-line expertise callout across Beats 8-9. Preserve approved storyboard
  evidence; run production QA and stop for separate human video approval.
- On 2026-11-03 the user requested a revised consumer-first Slide 2 opening and
  a review stop: Beat 1 centers only the consumer concept; Beat 2 expands it into
  the established relationship, with Beats 3-9 otherwise unchanged. The prior
  production authorization is paused pending opening storyboard re-approval.
  The approximately 57.313 s replacement recording at the original upload path
  is the selected new master; older course-package timing/captions are historical.
  Do not claim retiming is complete or resume full production/QA before approval.
- The user subsequently approved Beats 1-2 and supporting-text behaviour on
  2026-11-03. Keep both supporting lines in Beat 1, retain patient/carer support
  in Beat 2, and fade that supporting line at the Beat 3 invited-role cue.
  Preserve the core Relevant lived experience label, identity and anchor.
  Record this approval against regenerated artifacts; replacement-master
  timing/captions and full production validation remain outstanding.
- The user then confirmed storyboard approval and requested the clip. The
  approved consumer-first opening is now enabled in production. The selected
  master decodes to 2,527,488 / 44,100 seconds (57.312653 s), with 1720 frames
  at 30 fps and 24 canonical caption cues. Current phrase timing is documented
  in the package timing map; older production notes above are historical.
  Run full QA and stop for separate human video approval, not final export.

## Full-motion automated video QA

- Run the shared QA workflow for every new or changed registered video
  production composition after storyboard approval. Storyboard compositions
  use still/layout inspection, not MP4/audio/static-sequence QA.
  Do not copy QA scripts into a course package. Use the generic
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

## HyperFrames and Remotion

- Keep the existing Remotion project, compositions, media, root dependencies,
  storyboards, and production approval workflows intact. Remotion remains the
  canonical path for established productions and all currently approved videos.
- Use the separate `hyperframes/` workspace only for explicitly requested,
  opt-in HyperFrames experiments or future productions authorized for that
  framework. Do not register its compositions in `src/Root.tsx` or add
  HyperFrames dependencies to the repository root.
- Before creating or modifying a HyperFrames composition, read
  `hyperframes/AGENTS.md` and the installed `/hyperframes` skill, then consult
  the relevant HyperFrames CLI references. Follow the local workflow in
  `hyperframes/README.md`.
- A framework experiment does not authorize changes to approved scientific
  content, scripts, storyboards, narration, captions, or visual approvals.
  Keep course content distinct, label provisional material, and preserve the
  existing storyboard and video approval gates.
- Run HyperFrames lint/check and inspect preview snapshots before rendering.
  Validate rendered MP4 dimensions, frame rate, duration, and decodability
  with FFprobe/FFmpeg. Technical checks do not constitute human visual
  approval. Keep HyperFrames output under its ignored workspace output folders.
