---
description: "Review a RETProgram Remotion video for educational, accessibility, and render quality"
name: "RETProgram Quality Review"
argument-hint: "Provide the composition ID, approved script, narration asset, and frames or render."
---

# RETProgram video quality review

Review the specified RETProgram composition against [AGENTS.md](../AGENTS.md),
the [shared style and production guide](../README.md), and applicable installed
Remotion Agent Skills. Inspect the source composition and preview or rendered
frames where available.

## Inputs

- Course slug and video slug: `${input:target:Identify the video package}`
- Permitted scope: `${input:scope:Review-only by default; name any explicitly authorised fixes}`

- Composition ID and source path: `${input:composition:Identify the composition}`
- Approved script: `${input:script:Provide the source or say "not supplied"}`
- Narration asset and transcript: `${input:audio:Provide paths or say "not supplied"}`
- Rendered video or representative frames: `${input:render:Provide the output path or say "preview only"}`

## Review criteria

- **Accuracy:** visuals, labels, and narration do not change, overstate, or
  contradict approved scientific or medical content.
- **Storytelling:** each scene communicates one concept; imagery is meaningful,
  coherent, and not a slide-style sequence of bullets.
- **Design consistency:** shared RETProgram theme, vector language,
  typography, spacing, and restrained motion are consistent while course
  content remains appropriately specific.
- **Narration and captions:** scene timing follows actual audio; wording and
  caption timing match the approved transcript; missing or unverified sources
  are clearly identified.
- **Accessibility:** contrast, text size, caption legibility, safe areas, and
  comprehension are adequate.
- **Technical quality:** composition is 1920×1080 at 30 fps; inspect clipping,
  spacing, easing, visual continuity, transitions, and render defects.
- **Isolation:** IDs are unique, source/media paths match the target package,
  shared code does not import course content, and other videos are unchanged.
  Compare existing compositions against a pre-change baseline when shared
  code or structure changes. Preserve intentionally different legacy formats.

## Output

List only actionable findings, ordered by severity. For each, include severity,
scene/frame or file location, issue, evidence, and a concrete recommendation.
Distinguish confirmed defects from items that cannot be verified because
approved content, audio, captions, or rendered frames were not supplied.
Do not silently edit the project during a review-only task.
