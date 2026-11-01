# Slide 1 asset inventory

| Asset | Provenance | Status |
|---|---|---|
| `s01-slide01-temp-narration.mp3` | Byte-identical copy of user-supplied `public/audio/cci-health-innovation/section-01/s01-slide01-temp-narration.mp3` | Temporary narration master; original preserved |
| `closed-captions.json` | Measured narration phrase timings and local transcript | Canonical timing/text for WebVTT, plain transcript and optional Studio overlay; human review required |
| SVG line icons and diagram | Authored in reusable CCI components | Editable vectors; no stock characters |
| Inter | Existing repository `@remotion/google-fonts` integration | Loaded in weights 400, 500, 600, 700 |
| Visual reference | `references/cci-health-innovation/cci-slide-style-reference.png` | Design reference only; not embedded in video |

Audio SHA-256:
`6863e2feb894a83cf153aeb9bb45c971b368c30f0b99dc08368fa01700e78dff`.
Duration: 39.314250 s from bundled FFprobe; mono MP3 at 44,100 Hz.
The source is untrimmed and unstretched. No music or sound effects are added.
Rendered outputs and reports belong under ignored `out/`, not this directory.
The export workflow writes a clean MP4 plus matching `.vtt` and `.txt` sidecars
under `out/exports/`; no captions are burned into the production video.
