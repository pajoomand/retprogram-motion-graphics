---
description: "Design a purposeful Remotion animation for an approved RETProgram scene"
name: "RETProgram Animation Design"
argument-hint: "Provide the approved scene concept, narration phrase, and existing composition or component."
---

# RETProgram animation design

Design or implement the requested scene using the established production
guidance in [AGENTS.md](../AGENTS.md), the system notes in [README.md](../README.md),
and applicable installed Remotion Agent Skills.

## Inputs

- Course slug, video slug, and composition ID: `${input:target:Identify the target video package}`
- Permitted edit scope: `${input:scope:Name allowed files; existing videos and shared defaults are protected unless explicitly approved}`

- Approved scene and concept: `${input:scene:Describe one concept}`
- Supporting script/narration phrase: `${input:source:Paste the approved source phrase}`
- Existing component or composition: `${input:component:Name a file or say "new scene"}`
- Constraints: `${input:constraints:List duration, assets, or other requirements}`

## Requirements

- Before detailed motion, verify explicit human storyboard approval in the
  package's `production-status.json` and approved storyboard artifacts.
  A supplied script, successful storyboard generation, technical QA or this
  animation request alone is not storyboard approval. If absent, generate the
  storyboard and STOP: **Awaiting human storyboard approval.**
  Record approved production start with `npm run storyboard -- <ProductionId> start`.
  Preserve the storyboard's shared scene components and approved visual states.
  Trivial changes or explicitly requested identical reuse may retain the
  existing approval; record the exception scope, never invent a new approval.
- Confirm human storyboard review covered the
  [continuity and cognitive-load approval checklist](../README.md#continuity-and-cognitive-load-approval-checklist).
  Follow all [13 continuity rules](../AGENTS.md#storyboard-continuity-and-cognitive-load-review)
  during implementation. Do not treat a checklist, rule submission or technical
  pass as human approval.
- Do not add scientific statements or visual implications absent from the
  approved source.
- Use `src/courses/{course-slug}/{video-slug}/scenes/` for the target scene,
  its dedicated `public/courses/{course-slug}/{video-slug}/` media namespace,
  and reusable components from `src/shared/`. Do not modify another video.
- Communicate one concept through a diagram, illustration, connected system,
  callout, or meaningful visual metaphor; avoid slide-like bullet reveals and
  arbitrary movement.
- Treat each approved storyboard beat as a change from the previous state,
  not a new slide. Follow its Persists, Adds or changes, Attention target and
  justified Removes. Keep one main title for one teaching concept, keep
  persistent objects mounted/anchored, and accumulate enumerated ideas where
  space permits. Do not change title, layout and major object simultaneously.
  Transitions explain relationships; do not append a redundant final summary.
- Preserve persistent objects' wording, meaning, internal layout and animation
  progress across beats; do not fade unchanged objects out and back in or reset
  them. Use restrained opacity, contrast, scale or colour to shift attention.
  Reduce the prominence of established information when adding a conceptual
  layer, preserve generous spacing, and introduce one major attention change
  at a time. Retain safe-area clearance and readable labels. Hold the final
  resolved state long enough for comprehension.
- Do not add a persistent top banner/eyebrow without essential learning value.
  Prefer the recovered vertical space for the main explainer diagram.
- Continue the shared RETProgram theme, typography, contrast, spacing, and
  vector language. Keep course-specific content local to its scene.
- Use deterministic, frame-driven Remotion animation with smooth, purposeful
  easing. Keep scene duration configurable and text concise.
- Keep caption-safe placement and 16:9 safe margins in the 1920×1080, 30 fps
  composition.
- Inspect relevant source and existing user changes before editing. Follow the
  repository's component patterns and preserve editable scene structure.

## Output

Describe the visual beat and timing briefly, then implement only the requested
scene or component. Validate with focused type-check/lint commands and preview
the composition in Studio. Inspect representative rendered frames for
clipping, spacing, contrast, and transition defects.
