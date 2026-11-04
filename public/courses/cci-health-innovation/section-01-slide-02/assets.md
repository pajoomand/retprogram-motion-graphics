# CCI Section 1 Slide 2 source-media inventory

## Supplied narration and derived captions

- `s01-slide02-temp-narration.mp3`: selected replacement temporary recording.
  The original upload path `public/audio/cci-health-innovation/section-01/s01-slide02-temp-narration.mp3`
  holds the same recording (FFprobe approximately 57.313 s), selected by
  the user as the replacement master. The files are now byte-identical.
  The older 59.167-second course master, captions and analysis are preserved
  under `out/slide02-production/before-replacement-master/`.
- SHA-256: `d714d422b398124f2fe56732399dd7ad328c081faf061adb159f70ec8d69e61f`.
- Exact decoded duration: 2,527,488 samples / 44,100 Hz =
  57.31265306122449 s. 1720 production frames at 30 fps.
- `closed-captions.json`: canonical 24-cue Remotion Caption source with narration
  hash and duration. Derived locally with whisper.cpp and acoustic pause checks,
  not a human-verified transcript or medical approval.
- Matching WebVTT and transcript review sidecars are generated under
  `out/captions/CCIHealthInnovation-S01-Slide02/`. They are not burned in.
- Timing/provenance evidence lives beside source in `audio-analysis.json` and
  `timing-map.md`. No photography or external illustrations are used.

- User-supplied working draft narration is preserved in the source package's
  `narration-script.md`; it is not finalized narration or a verified transcript.
- Static diagrams are editable SVG/React using existing CCI icons and tokens.
- Style reference: `references/cci-health-innovation/cci-slide-style-reference.png`
  and the approved Section 1 Slide 1 design language, not its course content.
- Inter is loaded through the existing Remotion font-loading mechanism.
- Storyboard renders belong only in `out/storyboards/CCIHealthInnovation-S01-Slide02/`.

Do not reuse Slide 1 audio or claim human-verified caption synchronization.
