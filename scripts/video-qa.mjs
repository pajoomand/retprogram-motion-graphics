import { createServer } from "node:net";
import { spawnSync } from "node:child_process";
import {
  copyFile,
  mkdir,
  readFile,
  readdir,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { bundle } from "@remotion/bundler";
import {
  getCompositions,
  renderFrames,
  renderMedia,
} from "@remotion/renderer";
import { webpackOverride } from "../src/remotion/webpack-override.mjs";

const root = process.cwd();
const remotionCli = path.resolve(
  root,
  "node_modules",
  "@remotion",
  "cli",
  "remotion-cli.js",
);
const playwrightCli = path.resolve(
  root,
  "node_modules",
  "@playwright",
  "test",
  "cli.js",
);
const [mode, compositionId, outputArgument, reviewer, reviewNotes] =
  process.argv.slice(2);
const validModes = [
  "test",
  "render",
  "check",
  "report",
  "run",
  "export",
  "approve",
  "correction",
];

if (!validModes.includes(mode)) {
  throw new Error(
    `Usage: node scripts\\video-qa.mjs <${validModes.join("|")}> <CompositionId> [run-directory|export-path|correction-details...]`,
  );
}

if (!compositionId || !/^[A-Za-z0-9-]+$/.test(compositionId)) {
  throw new Error(
    "Provide a registered CompositionId using letters, numbers, and hyphens.",
  );
}

const configuration = JSON.parse(
  await readFile(path.resolve(root, "scripts", "qa-profiles.json"), "utf8"),
);
const compositionProfile = configuration.compositions[compositionId] ?? {};
const profile = {
  ...configuration.defaults,
  ...compositionProfile,
  blackDetection: {
    ...configuration.defaults.blackDetection,
    ...compositionProfile.blackDetection,
  },
  freezeDetection: {
    ...configuration.defaults.freezeDetection,
    ...compositionProfile.freezeDetection,
  },
  silenceDetection: {
    ...configuration.defaults.silenceDetection,
    ...compositionProfile.silenceDetection,
  },
};

function safeCompositionId(id) {
  return id.replace(/[^A-Za-z0-9-]/g, "_");
}

function currentRunId() {
  return `${new Date().toISOString().replace(/[:.]/g, "-")}-${process.pid}`;
}

function relativePath(filePath) {
  return path.relative(root, filePath).split(path.sep).join("/");
}

function runCli(cliPath, args, extraEnv = {}) {
  const result = spawnSync(process.execPath, [cliPath, ...args], {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
    env: { ...process.env, ...extraEnv },
  });

  if (result.error) {
    throw result.error;
  }

  return {
    status: result.status,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
  };
}

function addCheck(report, id, status, details, likelySource = "") {
  report.checks = report.checks.filter((check) => check.id !== id);
  report.checks.push({ id, status, details, likelySource });
}

function addIssue(report, id, severity, description, likelySource) {
  report.issues = report.issues.filter((issue) => issue.id !== id);
  report.issues.push({ id, severity, description, likelySource });
}

async function findVideoConfigs(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findVideoConfigs(entryPath)));
    } else if (entry.isFile() && entry.name === "video.config.ts") {
      files.push(entryPath);
    }
  }
  return files;
}

async function getVideoLabels(id) {
  const configFiles = await findVideoConfigs(
    path.resolve(root, "src", "courses"),
  );
  for (const configFile of configFiles) {
    const contents = await readFile(configFile, "utf8");
    const match = contents.match(/\bid\s*:\s*["']([^"']+)["']/);
    if (match?.[1] !== id) {
      continue;
    }

    const [courseSlug, videoSlug] = path
      .relative(path.resolve(root, "src", "courses"), path.dirname(configFile))
      .split(path.sep);
    const title = (slug) =>
      slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    return { course: title(courseSlug), video: title(videoSlug) };
  }
  return { course: "Uncatalogued", video: id };
}

async function getComposition(id) {
  const serveUrl = await bundle({
    entryPoint: path.resolve(root, "src", "remotion", "index.ts"),
    webpackOverride,
    rspack: true,
  });
  const compositions = await getCompositions(serveUrl);
  const composition = compositions.find((item) => item.id === id);
  if (!composition) {
    throw new Error(
      `Composition "${id}" is not registered. Registered IDs: ${compositions.map((item) => item.id).join(", ")}`,
    );
  }
  return { composition, serveUrl };
}

function getFrameSamples(composition) {
  const samples = new Map();
  const add = (frame, label) => {
    if (frame >= 0 && frame < composition.durationInFrames) {
      const current = samples.get(frame) ?? [];
      current.push(label);
      samples.set(frame, current);
    }
  };
  const boundaries = [];
  const defaultDurations = composition.defaultProps?.sceneDurations;

  if (Array.isArray(compositionProfile.sceneBoundaryFrames)) {
    boundaries.push(
      ...compositionProfile.sceneBoundaryFrames.map((frame) => ({
        frame,
        label: `Scene boundary ${frame}`,
      })),
    );
  } else if (defaultDurations && typeof defaultDurations === "object") {
    let cursor = 0;
    for (const [name, rawDuration] of Object.entries(defaultDurations)) {
      cursor += Number(rawDuration);
      if (cursor < composition.durationInFrames) {
        boundaries.push({ frame: cursor, label: name });
      }
    }
  }

  add(0, "Opening frame");
  add(composition.durationInFrames - 1, "Final frame");
  for (const boundary of boundaries) {
    add(boundary.frame - 1, `${boundary.label}: before`);
    add(boundary.frame, `${boundary.label}: after`);
    add(boundary.frame + 1, `${boundary.label}: transition hold`);
  }

  if (boundaries.length === 0) {
    add(Math.floor(composition.durationInFrames / 2), "Midpoint");
  }

  return Array.from(samples, ([frame, labels]) => ({ frame, labels })).sort(
    (a, b) => a.frame - b.frame,
  );
}

async function createRunDirectory(id) {
  const directory = path.resolve(
    root,
    "out",
    "qa",
    safeCompositionId(id),
    currentRunId(),
  );
  await mkdir(directory, { recursive: true });
  return directory;
}

async function findLatestRunDirectory(id) {
  const base = path.resolve(root, "out", "qa", safeCompositionId(id));
  let entries;
  try {
    entries = await readdir(base, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(
        `No QA runs found for ${id}; run "npm run qa:video -- ${id}" first.`,
      );
    }
    throw error;
  }

  const directories = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
    .reverse();
  for (const name of directories) {
    const directory = path.join(base, name);
    try {
      await readFile(path.join(directory, "report.json"), "utf8");
      return directory;
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error;
      }
    }
  }
  throw new Error(`No QA reports found for ${id}.`);
}

async function readOrCreateReport(directory, composition, id) {
  const reportPath = path.join(directory, "report.json");
  try {
    return JSON.parse(await readFile(reportPath, "utf8"));
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }

  const labels = await getVideoLabels(id);
  return {
    schemaVersion: 1,
    createdAt: new Date().toISOString(),
    course: labels.course,
    video: labels.video,
    compositionId: id,
    render: {
      width: composition.width,
      height: composition.height,
      fps: composition.fps,
      durationInFrames: composition.durationInFrames,
      expectedDurationSeconds:
        composition.durationInFrames / composition.fps,
      videoCodec: "h264",
      narrationSrc: composition.defaultProps?.narrationSrc || null,
    },
    checks: [],
    issues: [],
    correctionAttempts: [],
    visualReview: { approved: false, reviewer: null, notes: "" },
    status: "Awaiting human visual approval",
  };
}

async function getAvailablePort() {
  const server = createServer();
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      server.close((error) =>
        error ? reject(error) : resolve(port),
      );
    });
  });
}

async function runCompositionTest(id, directory, report) {
  const port = await getAvailablePort();
  const screenshotPath = path.join(directory, "studio-preview.png");
  const resultsDirectory = path.join(directory, "playwright-results");
  await mkdir(resultsDirectory, { recursive: true });
  const logPath = path.join(directory, "playwright.log");
  const result = runCli(
    playwrightCli,
    ["test", "--project=chromium"],
    {
      RETPROGRAM_QA_COMPOSITION_ID: id,
      RETPROGRAM_QA_PORT: String(port),
      RETPROGRAM_QA_SCREENSHOT: screenshotPath,
      RETPROGRAM_QA_RESULTS_DIR: resultsDirectory,
    },
  );
  await writeFile(
    logPath,
    `${result.stdout}${result.stderr ? `\n${result.stderr}` : ""}`,
  );
  const passed = result.status === 0;
  addCheck(
    report,
    "browser.studio",
    passed ? "passed" : "failed",
    passed
      ? "Studio loaded the composition; browser errors, failed requests, and text-bound checks passed."
      : `Playwright exited with status ${result.status}. See ${relativePath(logPath)}.`,
    passed
      ? ""
      : "Composition loading, browser console, network requests, or text layout in Remotion Studio.",
  );
  if (!passed) {
    addIssue(
      report,
      "browser.studio",
      "error",
      `Studio preview test failed. See ${relativePath(logPath)}.`,
      "Composition route, failed asset request, browser exception, or visible text extending beyond the preview.",
    );
  } else {
    report.artifacts = {
      ...(report.artifacts ?? {}),
      studioScreenshot: relativePath(screenshotPath),
      playwrightLog: relativePath(logPath),
    };
  }
  return passed;
}

async function renderPreview(composition, serveUrl, directory, report) {
  const framesDirectory = path.join(directory, "frames");
  await mkdir(framesDirectory, { recursive: true });
  const samples = getFrameSamples(composition);
  const samplesByFrame = new Map(
    samples.map((sample, index) => [sample.frame, { ...sample, index }]),
  );
  const sampledFrames = [];

  try {
    await renderFrames({
      composition,
      serveUrl,
      outputDir: null,
      inputProps: composition.defaultProps ?? {},
      imageFormat: "png",
      concurrency: 2,
      onStart: () => {},
      onFrameUpdate: (count) => {
        if (count > 0 && count % 300 === 0) {
          console.log(
            `  Rendered ${count} of ${composition.durationInFrames} frames`,
          );
        }
      },
      onFrameBuffer: async (buffer, frame) => {
        const sample = samplesByFrame.get(frame);
        if (!sample) {
          return;
        }
        const filename = `sample-${String(sample.index).padStart(3, "0")}.png`;
        const imagePath = path.join(framesDirectory, filename);
        await writeFile(imagePath, buffer);
        sampledFrames.push({
          frame,
          labels: sample.labels,
          file: relativePath(imagePath),
        });
      },
    });
    addCheck(
      report,
      "render.frames",
      "passed",
      `Rendered ${sampledFrames.length} representative frames at scene boundaries using Remotion.`,
    );
  } catch (error) {
    addCheck(
      report,
      "render.frames",
      "failed",
      error instanceof Error ? error.message : String(error),
      "Composition bundle or deterministic frame rendering.",
    );
    addIssue(
      report,
      "render.frames",
      "error",
      "Remotion could not render representative frames.",
      "Composition code, media assets, or renderer configuration.",
    );
    return false;
  }

  sampledFrames.sort((a, b) => a.frame - b.frame);
  const columns = Math.min(4, sampledFrames.length);
  const rows = Math.ceil(sampledFrames.length / columns);
  const contactSheetPath = path.join(directory, "contact-sheet.png");
  const contactSheet = runCli(remotionCli, [
    "ffmpeg",
    "-hide_banner",
    "-loglevel",
    "error",
    "-y",
    "-framerate",
    "1",
    "-start_number",
    "0",
    "-i",
    path.join(framesDirectory, "sample-%03d.png"),
    "-vf",
    `scale=480:-2,tile=layout=${columns}x${rows}`,
    "-frames:v",
    "1",
    contactSheetPath,
  ]);
  if (contactSheet.status !== 0) {
    addCheck(
      report,
      "render.contact-sheet",
      "failed",
      contactSheet.stderr || "FFmpeg could not create the contact sheet.",
      "Contact-sheet image pipeline.",
    );
    addIssue(
      report,
      "render.contact-sheet",
      "error",
      "Contact sheet generation failed.",
      "FFmpeg tile filter or sampled frame images.",
    );
  } else {
    addCheck(
      report,
      "render.contact-sheet",
      "passed",
      `Created a ${columns}-column contact sheet from ${sampledFrames.length} sampled frames.`,
    );
  }

  const videoPath = path.join(directory, "preview.mp4");
  try {
    await renderMedia({
      composition,
      serveUrl,
      codec: "h264",
      audioCodec: "aac",
      imageFormat: "jpeg",
      concurrency: 4,
      inputProps: composition.defaultProps ?? {},
      outputLocation: videoPath,
      overwrite: true,
    });
    addCheck(
      report,
      "render.preview",
      "passed",
      `Rendered ${relativePath(videoPath)} using H.264.`,
    );
  } catch (error) {
    addCheck(
      report,
      "render.preview",
      "failed",
      error instanceof Error ? error.message : String(error),
      "Remotion video encoding or composition rendering.",
    );
    addIssue(
      report,
      "render.preview",
      "error",
      "Remotion could not render the preview MP4.",
      "Composition code, media assets, or encoder configuration.",
    );
    return false;
  }

  report.render.output = relativePath(videoPath);
  report.artifacts = {
    ...(report.artifacts ?? {}),
    contactSheet: relativePath(contactSheetPath),
    sampledFrames,
  };
  await writeFile(
    path.join(directory, "render-manifest.json"),
    JSON.stringify(
      {
        compositionId: composition.id,
        width: composition.width,
        height: composition.height,
        fps: composition.fps,
        durationInFrames: composition.durationInFrames,
        sampledFrames,
        video: relativePath(videoPath),
        contactSheet: relativePath(contactSheetPath),
      },
      null,
      2,
    ),
  );
  return true;
}

function parseRate(rate) {
  if (typeof rate !== "string") {
    return null;
  }
  const [numerator, denominator] = rate.split("/").map(Number);
  return denominator ? numerator / denominator : null;
}

function parseBlackIntervals(log) {
  return Array.from(
    log.matchAll(
      /black_start:\s*([-\d.]+)\s+black_end:\s*([-\d.]+)\s+black_duration:\s*([-\d.]+)/g,
    ),
    (match) => ({
      start: Number(match[1]),
      end: Number(match[2]),
      duration: Number(match[3]),
    }),
  );
}

function parseFilterIntervals(log, prefix, totalDuration) {
  const starts = Array.from(
    log.matchAll(new RegExp(`${prefix}_start:\\s*([\\d.]+)`, "g")),
    (match) => Number(match[1]),
  );
  const ends = Array.from(
    log.matchAll(new RegExp(`${prefix}_end:\\s*([\\d.]+)`, "g")),
    (match) => Number(match[1]),
  );
  const durations = Array.from(
    log.matchAll(new RegExp(`${prefix}_duration:\\s*([\\d.]+)`, "g")),
    (match) => Number(match[1]),
  );
  return starts.map((start, index) => {
    const end = ends[index] ?? totalDuration;
    return {
      start,
      end,
      duration: durations[index] ?? Math.max(0, end - start),
    };
  });
}

function intervalIsAllowed(interval, allowedIntervals = []) {
  return allowedIntervals.some(
    (allowed) => interval.start >= allowed.start && interval.end <= allowed.end,
  );
}

function remotionFilter(args) {
  return runCli(remotionCli, ["ffmpeg", "-hide_banner", ...args]);
}

async function checkRenderedVideo(composition, directory, report) {
  const videoPath = path.join(directory, "preview.mp4");
  const probe = runCli(remotionCli, [
    "ffprobe",
    "-v",
    "error",
    "-show_entries",
    "stream=codec_type,codec_name,width,height,r_frame_rate,avg_frame_rate,duration,nb_read_frames,sample_rate,channels:format=duration,format_name",
    "-count_frames",
    "-of",
    "json",
    videoPath,
  ]);

  if (probe.status !== 0) {
    addCheck(
      report,
      "media.probe",
      "failed",
      probe.stderr || "FFprobe could not read the preview file.",
      "Rendered output file or FFprobe.",
    );
    addIssue(
      report,
      "media.probe",
      "error",
      "FFprobe failed to inspect the rendered MP4.",
      "Render output path, MP4 container, or FFprobe invocation.",
    );
    return;
  }

  const metadata = JSON.parse(probe.stdout);
  const video = metadata.streams?.find((stream) => stream.codec_type === "video");
  const audio = metadata.streams?.find((stream) => stream.codec_type === "audio");
  report.render.metadata = {
    format: metadata.format?.format_name ?? null,
    video,
    audio: audio ?? null,
    durationSeconds: Number(metadata.format?.duration),
  };

  const expectedDuration = composition.durationInFrames / composition.fps;
  const actualDuration = Number(video?.duration ?? metadata.format?.duration);
  const durationTolerance = Math.max(0.05, 1 / composition.fps);
  const metadataChecks = [
    {
      id: "media.video-stream",
      valid: Boolean(video),
      details: video
        ? `Video stream detected: ${video.codec_name}.`
        : "No video stream found.",
      source: "MP4 container or Remotion render output.",
    },
    {
      id: "media.video-codec",
      valid: video?.codec_name === "h264",
      details: `Expected h264; found ${video?.codec_name ?? "none"}.`,
      source: "Video codec selection.",
    },
    {
      id: "media.resolution",
      valid:
        video?.width === composition.width &&
        video?.height === composition.height,
      details: `Expected ${composition.width}x${composition.height}; found ${video?.width ?? "?"}x${video?.height ?? "?"}.`,
      source: "Composition dimensions or render output.",
    },
    {
      id: "media.frame-rate",
      valid:
        Math.abs(
          (parseRate(video?.avg_frame_rate) ?? Number.NaN) - composition.fps,
        ) < 0.02,
      details: `Expected ${composition.fps} fps; found ${video?.avg_frame_rate ?? "unknown"}.`,
      source: "Composition frame rate or variable-frame-rate output.",
    },
    {
      id: "media.duration",
      valid:
        Number.isFinite(actualDuration) &&
        Math.abs(actualDuration - expectedDuration) <= durationTolerance,
      details: `Expected ${expectedDuration.toFixed(3)}s ± ${durationTolerance.toFixed(3)}s; found ${Number.isFinite(actualDuration) ? `${actualDuration.toFixed(3)}s` : "unknown"}.`,
      source: "Composition duration, frame rate, or encoded stream.",
    },
  ];

  for (const check of metadataChecks) {
    addCheck(
      report,
      check.id,
      check.valid ? "passed" : "failed",
      check.details,
      check.valid ? "" : check.source,
    );
    if (!check.valid) {
      addIssue(report, check.id, "error", check.details, check.source);
    }
  }

  if (audio) {
    const audioCodecValid = audio.codec_name === "aac";
    addCheck(
      report,
      "media.audio-codec",
      audioCodecValid ? "passed" : "failed",
      `Expected AAC when audio is present; found ${audio.codec_name ?? "unknown"}.`,
      audioCodecValid ? "" : "Audio codec selection or encoded audio stream.",
    );
    if (!audioCodecValid) {
      addIssue(
        report,
        "media.audio-codec",
        "error",
        `Expected AAC when audio is present; found ${audio.codec_name ?? "unknown"}.`,
        "Audio codec selection or encoded audio stream.",
      );
    }

    const audioDuration = Number(audio.duration);
    if (Number.isFinite(audioDuration) && Number.isFinite(actualDuration)) {
      const withinTolerance =
        Math.abs(audioDuration - actualDuration) <=
        profile.audioVideoDurationToleranceSeconds;
      addCheck(
        report,
        "media.audio-video-duration",
        withinTolerance ? "passed" : "failed",
        `Audio ${audioDuration.toFixed(3)}s; video ${actualDuration.toFixed(3)}s; tolerance ${profile.audioVideoDurationToleranceSeconds}s.`,
        withinTolerance
          ? ""
          : "Narration trim, scene duration, or audio/video render boundary.",
      );
      if (!withinTolerance) {
        addIssue(
          report,
          "media.audio-video-duration",
          "error",
          "Audio and video stream durations differ beyond the configured tolerance.",
          "Narration trim, scene duration, or audio/video render boundary.",
        );
      }
    } else {
      addCheck(
        report,
        "media.audio-video-duration",
        "warning",
        "Audio/video duration comparison is unavailable because a stream duration is missing.",
        "Container stream metadata.",
      );
    }

    const silence = remotionFilter([
      "-i",
      videoPath,
      "-vn",
      "-af",
      `silencedetect=noise=${profile.silenceDetection.noise}:d=${profile.silenceDetection.minimumDurationSeconds}`,
      "-f",
      "null",
      "-",
    ]);
    if (silence.status !== 0) {
      addCheck(
        report,
        "audio.silence-detection",
        "failed",
        silence.stderr || "FFmpeg silence detection failed.",
        "Audio stream or FFmpeg audio filters.",
      );
    } else {
      const intervals = parseFilterIntervals(
        `${silence.stdout}\n${silence.stderr}`,
        "silence",
        actualDuration,
      ).filter(
        (interval) =>
          interval.duration >= profile.silenceDetection.minimumDurationSeconds,
      );
      const unexpected = intervals.filter(
        (interval) =>
          !intervalIsAllowed(
            interval,
            profile.silenceDetection.allowedIntervals,
          ),
      );
      addCheck(
        report,
        "audio.silence-detection",
        unexpected.length ? "warning" : "passed",
        unexpected.length
          ? `Detected ${unexpected.length} silence interval(s) requiring review.`
          : `No silence interval exceeded ${profile.silenceDetection.minimumDurationSeconds}s outside configured intentional pauses.`,
        unexpected.length
          ? "Narration, intentional pause, or audio gain."
          : "",
      );
      unexpected.forEach((interval, index) =>
        addIssue(
          report,
          `audio.silence-${String(index + 1).padStart(3, "0")}`,
          "warning",
          `Silence from ${interval.start.toFixed(2)}s to ${interval.end.toFixed(2)}s.`,
          "Confirm whether this interval is an intentional narration pause before changing audio.",
        ),
      );
    }
  } else if (report.render.narrationSrc) {
    addCheck(
      report,
      "media.audio-stream",
      "failed",
      `Narration is configured (${report.render.narrationSrc}) but the output contains no audio stream.`,
      "Narration asset URL, source file, or audio render path.",
    );
    addIssue(
      report,
      "media.audio-stream",
      "error",
      "Narration is configured but no audio stream was rendered.",
      "Narration asset URL, source file, or audio render path.",
    );
    addCheck(
      report,
      "audio.silence-detection",
      "not_applicable",
      "Silence detection cannot run without an audio stream.",
    );
  } else {
    addCheck(
      report,
      "media.audio-codec",
      "not_applicable",
      "No audio stream is present; no narration asset is supplied for this composition.",
    );
    addCheck(
      report,
      "media.audio-video-duration",
      "not_applicable",
      "Audio/video duration comparison is not applicable without an audio stream.",
    );
    addCheck(
      report,
      "audio.silence-detection",
      "not_applicable",
      "Silence detection is not applicable without an audio stream.",
    );
  }

  const decodedFrames = Number(video?.nb_read_frames);
  const integrityPassed =
    probe.status === 0 &&
    decodedFrames === composition.durationInFrames;
  addCheck(
    report,
    "media.decode-integrity",
    integrityPassed ? "passed" : "failed",
    integrityPassed
      ? `FFprobe decoded all ${decodedFrames} video frames without errors.`
      : `Expected ${composition.durationInFrames} decodable frames; found ${Number.isFinite(decodedFrames) ? decodedFrames : "unknown"}.`,
    integrityPassed ? "" : "Encoded MP4 integrity or codec output.",
  );
  if (!integrityPassed) {
    addIssue(
      report,
      "media.decode-integrity",
      "error",
      "FFmpeg reported errors while decoding the full video.",
      "Encoded MP4 integrity or codec output.",
    );
  }

  const black = remotionFilter([
    "-i",
    videoPath,
    "-vf",
    `blackdetect=d=${profile.blackDetection.minimumDurationSeconds}:pix_th=${profile.blackDetection.pixelThreshold}`,
    "-an",
    "-c:v",
    "libx264",
    "-preset",
    "ultrafast",
    "-crf",
    "40",
    "-f",
    "null",
    "-",
  ]);
  if (black.status !== 0) {
    addCheck(
      report,
      "video.black-detection",
      "failed",
      black.stderr || "FFmpeg black-frame detection failed.",
      "Video filter or encoded file.",
    );
  } else {
    const intervals = parseBlackIntervals(
      `${black.stdout}\n${black.stderr}`,
    ).filter(
      (interval) =>
        interval.duration >= profile.blackDetection.minimumDurationSeconds,
    );
    const unexpected = intervals.filter(
      (interval) =>
        !intervalIsAllowed(
          interval,
          profile.blackDetection.allowedIntervals,
        ),
    );
    addCheck(
      report,
      "video.black-detection",
      unexpected.length ? "failed" : "passed",
      unexpected.length
        ? `Detected ${unexpected.length} unapproved black interval(s).`
        : "No unapproved black interval was detected.",
      unexpected.length
        ? "Scene transition, opacity animation, or background rendering."
        : "",
    );
    unexpected.forEach((interval, index) =>
      addIssue(
        report,
        `video.black-${String(index + 1).padStart(3, "0")}`,
        "error",
        `Black interval from ${interval.start.toFixed(2)}s to ${interval.end.toFixed(2)}s (${interval.duration.toFixed(2)}s).`,
        "Inspect adjacent sampled frames and the scene transition at this time.",
      ),
    );
  }

  const freeze = remotionFilter([
    "-i",
    videoPath,
    "-vf",
    `freezedetect=n=${profile.freezeDetection.noise}:d=${profile.freezeDetection.minimumDurationSeconds}`,
    "-an",
    "-c:v",
    "libx264",
    "-preset",
    "ultrafast",
    "-crf",
    "40",
    "-f",
    "null",
    "-",
  ]);
  if (freeze.status !== 0) {
    addCheck(
      report,
      "video.freeze-detection",
      "failed",
      freeze.stderr || "FFmpeg freeze detection failed.",
      "Video filter or encoded file.",
    );
  } else {
    const intervals = parseFilterIntervals(
      `${freeze.stdout}\n${freeze.stderr}`,
      "freeze",
      actualDuration,
    ).filter(
      (interval) =>
        interval.duration >= profile.freezeDetection.minimumDurationSeconds,
    );
    const unexpected = intervals.filter(
      (interval) =>
        !intervalIsAllowed(
          interval,
          profile.freezeDetection.allowedIntervals,
        ),
    );
    addCheck(
      report,
      "video.freeze-detection",
      unexpected.length ? "warning" : "passed",
      unexpected.length
        ? `Detected ${unexpected.length} static interval(s); compare against the storyboard and sampled frames.`
        : "No static interval exceeded the configured threshold outside approved holds.",
      unexpected.length
        ? "Could be an intentional hold or frozen animation; visual review is required."
        : "",
    );
    unexpected.forEach((interval, index) =>
      addIssue(
        report,
        `video.freeze-${String(index + 1).padStart(3, "0")}`,
        "warning",
        `Static interval from ${interval.start.toFixed(2)}s to ${interval.end.toFixed(2)}s (${interval.duration.toFixed(2)}s).`,
        "Compare with the storyboard; add an intentional interval to the QA profile only when confirmed.",
      ),
    );
  }
}

function determineStatus(report) {
  const technicalFailure = report.checks.some(
    (check) => check.status === "failed",
  );
  report.technicalStatus = technicalFailure ? "failed" : "passed";
  report.status = technicalFailure
    ? "Technical checks failed"
    : report.visualReview?.approved
      ? "Technical checks passed"
      : "Awaiting human visual approval";
  return report.status;
}

function reportMarkdown(report) {
  const checks = report.checks
    .map(
      (check) =>
        `| ${check.id} | ${check.status} | ${check.details.replace(/\|/g, "\\|")} |`,
    )
    .join("\n");
  const issues = report.issues.length
    ? report.issues
        .map(
          (issue) =>
            `- **${issue.severity} — ${issue.id}:** ${issue.description} Likely source: ${issue.likelySource}`,
        )
        .join("\n")
    : "- No issues detected.";
  const sampledFrames = report.artifacts?.sampledFrames?.length
    ? report.artifacts.sampledFrames
        .map(
          (sample) =>
            `- Frame ${sample.frame} (${sample.labels.join(", ")}): [PNG](../../../../${sample.file})`,
        )
        .join("\n")
    : "- No sampled frames recorded.";

  return `# Video QA report: ${report.video}

- **Course:** ${report.course}
- **Composition:** \`${report.compositionId}\`
- **Run:** ${report.createdAt}
- **Status:** **${determineStatus(report)}**
- **Technical status:** ${report.technicalStatus}
- **Output:** ${report.render.output ? `[MP4](../../../../${report.render.output})` : "Not rendered"}
- **Specifications:** ${report.render.width}×${report.render.height} at ${report.render.fps} fps, ${report.render.expectedDurationSeconds.toFixed(2)} seconds; expected H.264 video.
- **Narration:** ${report.render.narrationSrc ?? "Not supplied; audio-specific checks are not applicable."}

## Checks

| Check | Result | Details |
|---|---|---|
${checks || "| — | not run | No checks recorded. |"}

## Visual artifacts

- **Contact sheet:** ${report.artifacts?.contactSheet ? `[PNG](../../../../${report.artifacts.contactSheet})` : "Not generated"}
- **Studio screenshot:** ${report.artifacts?.studioScreenshot ? `[PNG](../../../../${report.artifacts.studioScreenshot})` : "Not generated"}

${sampledFrames}

## Findings

${issues}

## Corrections and review

- **Corrections attempted:** ${report.correctionAttempts.length}
- **Visual review:** ${report.visualReview?.approved ? `Approved by ${report.visualReview.reviewer}. ${report.visualReview.notes}` : "Awaiting human visual approval; technical results do not establish subjective design quality."}
- **Remaining issues:** ${report.issues.length}

Review the contact sheet and scene-boundary frames for illustration consistency, typography, spacing, hierarchy, alignment, colour, transitions, motion, and RETProgram design-system compliance. Caption synchronization is not claimed without supplied narration or an approved transcript.
`;
}

async function writeReport(directory, report) {
  determineStatus(report);
  await writeFile(
    path.join(directory, "report.json"),
    JSON.stringify(report, null, 2),
  );
  await writeFile(path.join(directory, "report.md"), reportMarkdown(report));
  console.log(`QA report: ${relativePath(path.join(directory, "report.md"))}`);
  console.log(`Status: ${report.status}`);
}

async function readCorrectionAttempts(id) {
  try {
    const contents = await readFile(
      path.resolve(
        root,
        "out",
        "qa",
        safeCompositionId(id),
        "corrections.json",
      ),
      "utf8",
    );
    return JSON.parse(contents);
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

async function runAll(directory) {
  const { composition, serveUrl } = await getComposition(compositionId);
  const report = await readOrCreateReport(directory, composition, compositionId);
  report.checks = [];
  report.issues = [];
  report.correctionAttempts = await readCorrectionAttempts(compositionId);
  report.visualReview = { approved: false, reviewer: null, notes: "" };

  await runCompositionTest(compositionId, directory, report);
  const rendered = await renderPreview(
    composition,
    serveUrl,
    directory,
    report,
  );
  if (rendered) {
    await checkRenderedVideo(composition, directory, report);
  }
  await writeReport(directory, report);
  return { composition, directory, report };
}

async function runChecksForExistingRender(directory) {
  const { composition } = await getComposition(compositionId);
  const report = await readOrCreateReport(directory, composition, compositionId);
  report.checks = report.checks.filter(
    (check) =>
      !check.id.startsWith("media.") &&
      !check.id.startsWith("video.") &&
      !check.id.startsWith("audio."),
  );
  report.issues = report.issues.filter(
    (issue) =>
      !issue.id.startsWith("media.") &&
      !issue.id.startsWith("video.") &&
      !issue.id.startsWith("audio."),
  );
  await checkRenderedVideo(composition, directory, report);
  report.correctionAttempts = await readCorrectionAttempts(compositionId);
  await writeReport(directory, report);
}

async function runTestOnly(directory) {
  const { composition } = await getComposition(compositionId);
  const report = await readOrCreateReport(directory, composition, compositionId);
  await runCompositionTest(compositionId, directory, report);
  report.correctionAttempts = await readCorrectionAttempts(compositionId);
  await writeReport(directory, report);
}

async function runRenderOnly(directory) {
  const { composition, serveUrl } = await getComposition(compositionId);
  const report = await readOrCreateReport(directory, composition, compositionId);
  report.checks = report.checks.filter(
    (check) =>
      check.id !== "render.frames" &&
      check.id !== "render.contact-sheet" &&
      check.id !== "render.preview",
  );
  await renderPreview(composition, serveUrl, directory, report);
  report.correctionAttempts = await readCorrectionAttempts(compositionId);
  await writeReport(directory, report);
}

async function findRunDirectory(id, explicitDirectory) {
  return explicitDirectory
    ? path.resolve(root, explicitDirectory)
    : findLatestRunDirectory(id);
}

async function regenerateReport(directory) {
  const report = JSON.parse(
    await readFile(path.join(directory, "report.json"), "utf8"),
  );
  report.correctionAttempts = await readCorrectionAttempts(compositionId);
  await writeReport(directory, report);
}

async function approveVisualReview(directory, reviewerName, notes) {
  if (!reviewerName || !notes) {
    throw new Error(
      "Visual approval requires a reviewer name and review notes after inspecting the contact sheet and sampled frames.",
    );
  }
  const report = JSON.parse(
    await readFile(path.join(directory, "report.json"), "utf8"),
  );
  if (report.technicalStatus !== "passed") {
    throw new Error(
      "Visual approval cannot be recorded while technical checks have failed.",
    );
  }
  report.visualReview = {
    approved: true,
    reviewer: reviewerName,
    notes,
    reviewedAt: new Date().toISOString(),
  };
  await writeReport(directory, report);
}

async function recordCorrection(id, issueId, likelyCause, change, result) {
  if (!issueId || !likelyCause || !change || !result) {
    throw new Error(
      'Record corrections as: npm run qa:correction -- <CompositionId> <issue-id> "likely cause" "change summary" "result"',
    );
  }
  const baseDirectory = path.resolve(
    root,
    "out",
    "qa",
    safeCompositionId(id),
  );
  const correctionPath = path.join(baseDirectory, "corrections.json");
  await mkdir(baseDirectory, { recursive: true });
  let attempts = [];
  try {
    attempts = JSON.parse(await readFile(correctionPath, "utf8"));
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
  const issueAttempts = attempts.filter((attempt) => attempt.issueId === issueId);
  if (issueAttempts.length >= 3) {
    throw new Error(
      `Issue ${issueId} already has three correction attempts; stop and request human review.`,
    );
  }
  attempts.push({
    issueId,
    attempt: issueAttempts.length + 1,
    likelyCause,
    change,
    result,
    recordedAt: new Date().toISOString(),
  });
  await writeFile(correctionPath, JSON.stringify(attempts, null, 2));
  console.log(
    `Recorded correction ${issueAttempts.length + 1}/3 for ${issueId}.`,
  );
  const latest = await findLatestRunDirectory(id);
  await regenerateReport(latest);
}

async function main() {
  if (mode === "correction") {
    await recordCorrection(
      compositionId,
      outputArgument,
      reviewer,
      reviewNotes,
      process.argv[7],
    );
    return;
  }

  if (mode === "report" || mode === "check" || mode === "approve") {
    const directory = await findRunDirectory(compositionId, outputArgument);
    if (mode === "report") {
      await regenerateReport(directory);
    } else if (mode === "check") {
      await runChecksForExistingRender(directory);
    } else {
      await approveVisualReview(directory, reviewer, reviewNotes);
    }
    return;
  }

  const directory = await createRunDirectory(compositionId);
  if (mode === "test") {
    await runTestOnly(directory);
    if (JSON.parse(await readFile(path.join(directory, "report.json"), "utf8"))
      .technicalStatus === "failed") {
      process.exitCode = 1;
    }
    return;
  }
  if (mode === "render") {
    await runRenderOnly(directory);
    if (JSON.parse(await readFile(path.join(directory, "report.json"), "utf8"))
      .technicalStatus === "failed") {
      process.exitCode = 1;
    }
    return;
  }
  if (mode === "run" || mode === "export") {
    const result = await runAll(directory);
    if (result.report.technicalStatus !== "passed") {
      process.exitCode = 1;
      return;
    }
    if (mode === "export") {
      if (!outputArgument) {
        throw new Error(
          "Provide an export path under out\\\\, e.g. out\\\\exports\\\\RETProgramInformedConsent.mp4",
        );
      }
      const exportPath = path.resolve(root, outputArgument);
      const outputRoot = path.resolve(root, "out") + path.sep;
      if (!exportPath.startsWith(outputRoot)) {
        throw new Error("Final exports must be written under the ignored out directory.");
      }
      await mkdir(path.dirname(exportPath), { recursive: true });
      await copyFile(path.join(directory, "preview.mp4"), exportPath);
      result.report.export = relativePath(exportPath);
      await writeReport(directory, result.report);
      console.log(`Final export: ${relativePath(exportPath)}`);
    }
  }
}

await main();
