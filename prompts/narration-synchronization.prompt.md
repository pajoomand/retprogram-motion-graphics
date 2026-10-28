---
description: "Align approved RETProgram scenes and captions to supplied narration audio"
name: "RETProgram Narration Synchronization"
argument-hint: "Provide the approved script, narration file path, and scene sequence."
---

# RETProgram narration synchronization

Synchronize the approved RETProgram scene sequence and captions to the supplied
narration. Follow [AGENTS.md](../AGENTS.md), [README.md](../README.md), and the
installed Remotion captions and multimedia skills.

## Inputs

- Course slug, video slug, and composition ID: `${input:target:Identify the target video package}`
- Permitted edit scope: `${input:scope:Limit updates to this video's timing, narration, captions, and configuration}`

- Approved script or transcript: `${input:script:Paste or link the approved text}`
- Narration audio under `public/courses/{course-slug}/{video-slug}/`: `${input:audio:Provide the project-relative audio path}`
- Current scene sequence or composition: `${input:sequence:Name the sequence or composition}`
- Existing caption source: `${input:captions:Provide the caption file or say "not prepared"}`

## Requirements

- Use the actual audio and approved transcript as the source of timing and
  wording. Never fabricate word timings or imply synchronization if the audio
  cannot be accessed.
- Do not retime other videos or replace shared defaults. Preserve proof-cut
  timing unless the requested scope explicitly includes that cut.
- Preserve scientific terminology, punctuation, and the intended meaning.
  Flag differences between audio and approved text for review; do not silently
  rewrite either.
- Align scene boundaries to narration phrases and pauses. Keep durations
  configurable and update composition duration accordingly.
- Use Remotion's caption JSON format and keep each caption group inside its
  corresponding scene sequence so trimming or moving a scene keeps captions
  synchronized.
- Maintain readable caption styling, accessible contrast, and a clear lower
  safe area without obscuring important diagrams.
- Do not add narration, music, or sound effects that were not requested.

## Output

Report the source assets used, timing method, scene boundary changes, caption
format and any unresolved transcript/audio discrepancies. Implement timing and
caption updates, then preview and inspect frames at scene changes and caption
boundaries.
