# Understanding Informed Consent storyboard

Migrated from existing source and README, not a new creative treatment.
Defaults: 1920x1080, 30 fps. Timing is provisional, not verified against audio.

## Full sequence: RETProgramInformedConsent

| Scene component | Frames (inclusive) | Seconds | Existing visual and concept |
|---|---|---|---|
| UnderstandingScene | 0-179 | 0-6 | Trial document connects to understanding before joining. |
| ConversationScene | 180-449 | 6-15 | Researcher/participant conversation connects purpose, procedures, potential risks, benefits, and alternatives. |
| VoluntaryChoiceScene | 450-719 | 15-24 | Participate/Decline routes and withdrawal communicate voluntary participation. |
| ConclusionScene | 720-899 | 24-30 | Understanding, Rights, and Choice form the conclusion. |

## Proof: RETProgramInformedConsentProof

| Scene component | Frames (inclusive) | Seconds |
|---|---|---|
| UnderstandingScene | 0-179 | 0-6 |
| ConversationScene | 180-539 | 6-18 |

Both cuts intentionally share the scenes in this package. The proof's second
scene holds longer and has separate caption timing. Captions remain inline in
each scene's Sequence in the respective entry file for Studio editing.

Scene durations are editable in composition props and validated by `props.ts`.
The sum determines runtime. FPS is configured in `video.config.ts`; changing
FPS requires a deliberate review of frame-based motion and caption timing.
No scene content, layout, or motion was redesigned for the migration.
