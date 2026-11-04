# CCI Slide 1 — HyperFrames workspace

This is a separate HyperFrames workspace earmarked for CCI Health Innovation,
Section 1, Slide 1: **“One health problem, different perspectives.”** The
three-second composition is only a pipeline smoke test using the approved CCI
palette and title. It is not the full animation, a new storyboard, a proof of
style, or a visually approved deliverable. No narration, transcript, or captions
are included.

The existing Remotion composition
`CCIHealthInnovation-S01-Slide01` and its approved storyboard remain the
canonical production workflow. This project does not replace or register a
Remotion composition. Its source references are the existing
[Slide 1 storyboard](../src/courses/cci-health-innovation/section-01-slide-01/storyboard.md),
[theme tokens](../src/shared/themes/cci.ts), and
[narration notes](../src/courses/cci-health-innovation/section-01-slide-01/narration-script.md).
The narration text is a local machine transcription of temporary audio;
transcript, caption timing, and scientific-content review remain outstanding.

## Setup

The project was scaffolded with the official HyperFrames CLI using its blank
template, landscape resolution, and non-interactive mode. From the repository
root, update and check the shared HyperFrames skills:

```cmd
npx --yes hyperframes skills update
npx --yes hyperframes skills check
```

For a different, new video workspace, run the CLI from its parent folder with
a unique folder name, for example:

```cmd
npx --yes hyperframes@0.9.9 init new-video --example blank --resolution landscape --non-interactive --skip-skills
```

This `hyperframes/` workspace has already been initialized; do not rerun
`init` over it.

Codex reads the installed shared skills from `%USERPROFILE%\.agents\skills`.
Restart Codex after installing or updating skills so it discovers them. At the
start of HyperFrames authoring, read `/hyperframes` and the relevant
`/hyperframes-cli` references.

FFmpeg 9.0.2 was installed with WinGet for local rendering. Open a fresh
terminal after installation so the updated user `PATH` is loaded. If an
already-running terminal still cannot resolve `ffmpeg`, prepend the installed
FFmpeg `bin` directory to that CMD session's `PATH`.

## Preview and iterate

From the repository root:

```cmd
cd /d hyperframes
npx --yes hyperframes@0.9.9 lint
npm run check
npx --yes hyperframes@0.9.9 snapshot --at 1.5
npx --yes hyperframes@0.9.9 preview --background
npx --yes hyperframes@0.9.9 preview --status
```

Open the preview URL printed by the CLI and review it in a browser. Use
snapshots during iteration; a passing check is not visual review. Stop the
background preview when finished:

```cmd
npx --yes hyperframes@0.9.9 preview --stop
```

Keep all timing deterministic and frame-seekable. Make narrow iterations in
`index.html`, rerun lint/check, and inspect changed snapshots. Do not copy
approved CCI media into this workspace merely for convenience.

## Narration and captions

Do not attach audio or claim synchronization until the selected narration master
and transcript have been reviewed by a human. The existing Slide 1 audio is
temporary, and its transcript and measured caption timings are machine-derived
and explicitly review-required. Once authorized source material is available,
consult `npx --yes hyperframes@0.9.9 transcribe --help` for draft transcription
workflow, then compare the transcript and phrase boundaries against the actual
audio and obtain human transcript/caption review. Keep approved wording and
timings as distinct source material; machine output alone is not approval.

## Render and verify

Render only the requested smoke test or an explicitly approved composition:

```cmd
npx --yes hyperframes@0.9.9 render --quality draft -o out\cci-s01-slide01-smoke-test.mp4
ffprobe -v error -show_entries stream=codec_type,codec_name,width,height,r_frame_rate,duration:format=duration -of default=noprint_wrappers=1 out\cci-s01-slide01-smoke-test.mp4
ffmpeg -v error -i out\cci-s01-slide01-smoke-test.mp4 -f null -
```

The smoke-test target is 1920×1080 at 30 fps for three seconds. Confirm the
reported dimensions, frame rate, duration, and video stream, then decode the
entire MP4 with FFmpeg. Use `npx --yes hyperframes@0.9.9 check --json` and preview
snapshots as additional technical/layout checks. Keep renders in this
workspace's ignored `out\` folder. Technical checks and a generated MP4 do not
constitute storyboard or video approval.

## Choosing HyperFrames or Remotion

- Continue using the repository's existing Remotion compositions, shared CCI
  components, registration, narration/caption workflow, storyboard approvals,
  QA gates, and approved exports for all established production.
- Use this separate HyperFrames workspace only for explicitly requested,
  opt-in experiments or future work authorized for HyperFrames. Do not alter
  root `package.json`/lockfiles, `src/Root.tsx`, existing Remotion assets, or
  production compositions as part of this workspace.
- Preserve the approved script, storyboard, scientific meaning, caption
  requirements, and approval state. A framework change is not approval to
  change content, bypass review, or treat a smoke test as a finished video.
