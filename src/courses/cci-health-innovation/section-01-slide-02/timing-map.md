# Slide 2 - narration-led production timing

## Current selected narration - 2026-11-03

The user approved the consumer-first storyboard and requested the clip.
The selected upload is now copied into the dedicated course media package;
both current files have SHA-256
`d714d422b398124f2fe56732399dd7ad328c081faf061adb159f70ec8d69e61f`.
Native decoded audio is **2,527,488 samples / 44,100 Hz =
57.31265306122449 s**. Production is **1720 frames / 57.333333 s** at
1920 x 1080, 30 fps: 20.680 ms of frame rounding, no added hold or silent tail.

The current [audio analysis](./audio-analysis.json) contains fresh local
Whisper tokens and acoustic pauses from this master, not proportionally scaled
old timings. Sub-word timing remains a machine estimate requiring human review.

| Beat | Narration cue | Start frame | Duration |
|---|---|---:|---:|
| 1 | In this course | 0 | 412 |
| 2 | Being a patient or carer | 412 | 227 |
| 3 | What matters is the role | 639 | 98 |
| 4 | helping a team understand a need | 737 | 65 |
| 5 | question an assumption | 802 | 47 |
| 6 | consider options | 849 | 37 |
| 7 | or inform a decision | 886 | 69 |
| 8 | People with lived experience do not need to become overnight experts | 955 | 413 |
| 9 | It is also important to consider whose lived experience voices | 1368 | 352 |

Beat 1 holds the centered consumer definition without the workspace. At frame
412 the same mounted consumer/labels travel gently left over 42 frames, with
no overshoot. The opening expertise descriptor fades over 18 frames.
The workspace/identity fade in from frame 442 over 18 frames; the dashed link
and local distinction follow from frame 460 over 20 frames. The title stays fixed.
Patient/carer support persists through Beat 2 and fades at frame 639 over
18 frames without moving the core label.

Technical-expertise wording reveals at frame 1021; the realistic-perspective
line at 1209. The final question appears at frame 1368. Stage markers reveal
at **1535 (concept), 1553 (design/implementation), 1613 (delivery)**.
The selected narration says "from concept and design, through implementation
to delivery"; the approved three-node grouping is retained. The pathway
completes at frame 1631 and holds for **89 frames / 2.967 seconds** through
frame 1719, with no recap. The complete three-line expertise callout and its
internal layout persist unchanged across Beats 8-9.

Canonical captions contain **24 cues** from the selected recording. The clean
MP4 has no burned-in captions; matching WebVTT and transcript come from the same
JSON and master hash. They require human transcript/timing review, not merely
technical QA. The original draft remains unchanged; recorded wording differences
are listed in the analysis.

The old course recording, captions, analysis and pre-change Git status are
preserved under `out/slide02-production/before-replacement-master/`.

## Historical 59.167-second timing (not active)

The user approved the nine-state continuous storyboard on 2026-11-02 and
authorized full motion, with only larger final stage labels (32 px) and a
slightly softer contribution list (60% opacity). The production uses the same
mounted [scene](./scenes/ContributionStory.tsx) as the approved storyboard.
There is no recap scene. The original measured audio evidence is unchanged.

Storyboard visually approved by the user on 2026-11-02. The user explicitly
requested the full sequence after timing preparation, rather than a separate
15-20 second proof. This map was established before detailed animation.

### Historical master evidence

- Original upload path now contains the selected replacement recording; it is
  no longer byte-identical to the historical course-package recording.
- Historical analysed recording: `public/courses/cci-health-innovation/section-01-slide-02/s01-slide02-temp-narration.mp3`.
- SHA-256: `156d72377724c41138c04b9d98eb9521aa1dca69d1b37a16720e6c76d48c5547`.
- FFprobe reports **59.167313 s** (MP3 duration estimated from bitrate).
- Native decoded mono PCM: **2,609,280 samples / 44,100 Hz =
  59.16734693877551 s**. Use decoded sample count as exact audio duration.
- Production: **1776 frames / 59.2 s**, 1920 x 1080 at 30 fps.
  Ceiling to a whole video frame adds only **32.653 ms**, not a silent tail.
- Local whisper.cpp v1.7.6, small.en model; no audio sent to a service.
  FFmpeg `silencedetect` at -35 dB, minimum 0.08 seconds, refines phrase
  onsets. [audio-analysis.json](./audio-analysis.json) preserves all recognition
  segments/tokens, acoustic pauses, measured durations, and cue evidence.
- Token timings within continuous speech remain machine estimates, not
  human-verified forced alignment. Captions and transcript require human review.

## Historical state timing (superseded opening and master; do not implement)

| Beat / state | Audio cue (seconds) | Video start | Duration (frames) | Hold / transition intent |
|---|---:|---:|---:|---|
| 1. Distinct anchors | 0.080068: In this course... | 0 | 410 | Establish the fixed title, person and innovation workspace with no connection. Hold for the definition. |
| 2. Experience is not involvement | 13.675578: Being a patient or carer... | 410 | 236 | Introduce the dashed connection and explicit local distinction; keep both anchors. |
| 3. Invited role | 21.540113: What matters here is the role... | 646 | 111 | Transform the same connector from dashed to solid over 20 frames. Local invitation label settles; no reset. |
| 4. Understand a need | 25.229320: helping a team understand a need | 757 | 68 | Add first icon/label row in 12 frames, then hold. |
| 5. Question an assumption | 27.512063: question an assumption | 825 | 46 | Add the second row, retaining the first; not an equal time interval. |
| 6. Consider options | 29.030567: consider options | 871 | 35 | The shortest spoken example; quick restrained reveal then stable readable pose. |
| 7. Inform a decision | 30.215828: or make a decision | 906 | 62 | Add fourth row; all four remain visible. No success badge. |
| 8. Expertise | 32.263968: The role of people with lived experience... | 968 | 438 | Shift emphasis to the person; soften workspace, introduce compact callout. Technical line at frame 1062 (measured overnight-expert phrase), perspective line at 1151. |
| 9. Whose voices? | 46.881655: It's always important to consider... | 1406 | 370 | Retain every conceptual anchor and the identical full three-line expertise callout; soften overall list/callout emphasis and introduce lower question. Preserve 34 px question-to-icons clearance. Voice cues remain 1530, 1574 and 1677; pathway completes at 1695, then holds for 81 frames (2.7 s) to frame 1775, with no recap. |

Starts are rounded to the nearest video frame (maximum half-frame error).
Beat 1 begins at frame 0 to provide a visible opening before the first sound.
The former editorial recap cue at frame 1706 remains historical evidence in
`audio-analysis.json`, not an active scene boundary. The final state holds after
the delivery reveal settles at frame 1695, through the actual master ending.
No new narration, repeated definition or filler motion is added.

## Phrase-led progression within longer ideas

| Spoken phrase | Audio cue (s) | Frame |
|---|---:|---:|
| relevant lived experience (established opening hold) | 2.52 | 76 |
| including carers (established opening hold) | 6.956939 | 209 |
| who contribute their knowledge and perspectives (opening hold, no premature connector) | 8.398231 | 252 |
| inform and shape innovation (opening hold) | 10.81 | 324 |
| overnight expert in science or technology | 35.402494 | 1062 |
| relevant and realistic perspective | 38.370023 | 1151 |
| as a team member (comprehension hold, no decorative pulse) | 41.43 | 1243 |
| inform the concept | 51.00 | 1530 |
| design and implementation | 52.468753 | 1574 |
| delivery | 55.897211 | 1677 |

Where no acoustic pause separates words, these sub-cues use recognition token
onsets rather than claiming sample-exact word timing. Scene durations are
configurable, sum to the measured master, and drive registration and QA boundary
sampling. Retiming a scene requires deliberate review of its sub-cues and
the fixed audio/caption source; changing FPS does not retime authored motion.

## Transcript and caption status

Preserve [the original draft](./narration-script.md). The machine transcript of
the recording ends **"to ensure it has the greatest impact."** rather than the
draft's **"to ensure it can have the greatest impact/effect."** The recording is
the timing/content source for sidecar captions, not an instruction to rewrite
the approved visual concept or silently finalize the draft.

Canonical `closed-captions.json` uses Remotion Caption records, audio hash and
measured master duration. WebVTT and plain transcript are generated from that
single source. `showCaptions` is fixed to false; no burned-in caption overlay.
Review sidecars are under `out/captions/CCIHealthInnovation-S01-Slide02/`.
Final output remains gated on human video approval.
