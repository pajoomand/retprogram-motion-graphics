---
description: "Create an approval-ready educational storyboard from an approved RETProgram script"
name: "RETProgram Storyboarding"
argument-hint: "Provide the approved script, audience, learning objectives, and desired runtime."
---

# RETProgram educational storyboard

Create a scene-by-scene storyboard for a RETProgram training video using the
repository's [production brief](../AGENTS.md) and [shared design system](../README.md).

## Inputs

- Course slug, video slug, and composition IDs: `${input:target:Identify the new video package}`
- Permitted edit scope: `${input:scope:Default to the new package and its new Root registration; existing videos are out of scope}`

- Approved script: `${input:script:Paste the approved script or excerpt}`
- Audience and prior knowledge: `${input:audience:Describe intended learners}`
- Learning objectives: `${input:objectives:List approved learning objectives}`
- Target runtime: `${input:runtime:Specify duration or say "propose"}`
- Narration asset or timing notes: `${input:narration:Provide the audio path or note that it is not yet available}`

## Requirements

- Preserve the script's scientific and medical meaning; do not invent claims,
  advice, findings, or curriculum details.
- Save the draft storyboard and supplied script only in the target
  `src/courses/{course-slug}/{video-slug}/` package. Never replace another
  video's content to create this one.
- Give each scene one clear educational concept and a visual metaphor or
  diagram that explains it.
- Let narration determine scene order and pacing. If audio is unavailable,
  label timing provisional and do not claim synchronization.
- Use brief, readable on-screen text and leave a high-contrast safe area for
  captions.
- Follow the shared RETProgram palette, type, vector illustration, and
  purposeful motion principles while making this course's content and
  storyboard specific to its approved script.
- Author approximately 6-10 meaningful representative key states, not evenly
  spaced timestamps. Reuse production scene components and design tokens.
  Static layout implementation is permitted before approval; detailed motion
  is not. Do not implement easing, connector drawing or narration sync yet.
- A storyboard beat represents a change from the previous visual state, not a
  new slide. Document Persists, Adds or changes, Attention target and Removes
  for every beat; give a reason for every removed element.
- Keep the main title stable within one teaching concept, keep persistent
  conceptual components mounted/anchored, and build enumerated ideas cumulatively
  where space permits. Do not change title, layout and major object simultaneously.
  Let transitions explain relationships. Finish on an established state rather
  than adding a redundant summary without a narration need.
- Omit persistent top banners/eyebrows unless they add essential learning
  value. Use the recovered space for the main diagram, not additional text.
- Supporting explanatory text may retire with a restrained fade only when
  narration has clearly moved beyond its instructional purpose. Document the
  reason in Removes; preserve the component's core identity, meaning and visual
  anchor. Do not remove supporting text merely to simplify a frame.
- Apply all [continuity and cognitive-load rules](../AGENTS.md#storyboard-continuity-and-cognitive-load-review)
  and complete the [sequence review checklist](../README.md#continuity-and-cognitive-load-approval-checklist).
  Preserve persistent components' wording, meaning, internal layout and animation
  continuity; do not reset them or fade unchanged objects out and back in.
  Shift attention with restrained emphasis, opacity, contrast, scale or colour.
  Reduce density when adding a conceptual layer; retain context with generous
  spacing rather than squeezing new content into leftover areas.
  Review title/content and heading/diagram spacing, safe areas, text sizes and
  balanced use of the canvas. Reclaimed header space must improve composition.
  Introduce one major attention change at a time.
- Review the entire sequence for logical growth, guided attention, stable objects,
  understandable cumulative information and a readable conclusion with a
  comprehension hold. Report this review without claiming human approval.
- Register an explicit `<ProductionId>-Storyboard` composition alongside the
  production placeholder. Add `storyboard.config.json` using the README
  contract. Studio hold frames are inspection slots, never narration timing.
- Run `npm run storyboard -- <ProductionId>` for individual PNGs, a labelled
  contact sheet and Markdown; inspect key states in Studio and rendered PNGs.
- STOP after generation. Never approve on behalf of the user or continue into
  full motion. After explicit human storyboard approval is recorded, begin
  with a 15–20-second proof of style before developing the full sequence.

## Output

1. A concise visual direction within the shared RETProgram system.
2. A table with scene name, concept, source script phrase, visual metaphor,
   on-screen text, caption/narration considerations, and provisional or
   audio-verified timing.
3. Questions or source ambiguities that require educator or subject-matter
   expert review.
4. A separate 15–20-second proof-of-style excerpt proposal.
5. Storyboard composition ID, contact-sheet location, Markdown location, beat
   count and brief proposed visual concept.
6. The exact status: **Awaiting human storyboard approval.**
7. A continuity and cognitive-load review covering stable-title strategy,
   component persistence, cumulative behaviour, meaningful transitions,
   hierarchy, spacing and final-state clarity, with unresolved issues identified
   for human review before detailed motion, narration sync or final rendering.

Every Markdown beat must include **Narration cue:**, **Visual:**, **Purpose:**
and **Transition intention:**, plus **Persists:**, **Adds or changes:**,
**Attention target:** and **Removes:**. Use `removes: []` for no removals or
`[{ "element": "...", "reason": "..." }]` for justified removals in the manifest.
Do not invent exact timestamps.
