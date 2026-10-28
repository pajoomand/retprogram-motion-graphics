# RETProgram style proof: preserved source timeline

Composition: RETProgramStyleProof. 1920x1080, 30 fps, 540 frames.
Script-free brand study, not medical curriculum.

The original source differs from the earlier conceptual storyboard. This
migration preserves its actual implementation, including its initial hold:

| Existing source beat | Default source frames (inclusive) | Scene |
|---|---|---|
| Paper/dotted background | 0-119 | Background only |
| Brand opening | 120-209 | OpeningScene |
| Connected system | 210-449 | NetworkScene |
| Brand resolution | 450-539 | ClosingScene |

The `formation` duration still contributes to the offsets and total, but there
is no separate formation Sequence in the existing source. The outer
AbsoluteFill's existing timing props are preserved, not repaired or reinterpreted.
The configuration remains 90/120/240/90 frames. Changes to these unusual
legacy timing relationships require a separate approved visual task.
