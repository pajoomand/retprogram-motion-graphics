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

- Approved scene and concept: `${input:scene:Describe one concept}`
- Supporting script/narration phrase: `${input:source:Paste the approved source phrase}`
- Existing component or composition: `${input:component:Name a file or say "new scene"}`
- Constraints: `${input:constraints:List duration, assets, or other requirements}`

## Requirements

- Do not add scientific statements or visual implications absent from the
  approved source.
- Communicate one concept through a diagram, illustration, connected system,
  callout, or meaningful visual metaphor; avoid slide-like bullet reveals and
  arbitrary movement.
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
