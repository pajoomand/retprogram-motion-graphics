import { readFile, unlink } from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";

export async function createContactSheet(samples, outputPath, root) {
  const images = await Promise.all(
    samples.map(async (sample) => ({
      frame: sample.frame,
      data: (await readFile(path.resolve(root, sample.file))).toString(
        "base64",
      ),
    })),
  );
  const columns = Math.min(4, images.length);
  if (!columns)
    throw new Error("Cannot create a contact sheet without frames.");
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({
      viewport: { width: columns * 480, height: 306 },
      deviceScaleFactor: 1,
    });
    await page.setContent(
      `<html><body style="margin:0;background:#e8e8e8;font:18px Arial">
      <main style="display:grid;grid-template-columns:repeat(${columns},480px)">
      ${images.map((image) => `<figure style="margin:0"><img width="480" height="270" style="display:block" src="data:image/png;base64,${image.data}"><figcaption style="height:36px;line-height:36px;padding-left:14px;box-sizing:border-box">Frame ${image.frame}</figcaption></figure>`).join("")}
      </main></body></html>`,
      { waitUntil: "load" },
    );
    await page.screenshot({ path: outputPath, fullPage: true });
  } finally {
    await browser.close();
  }
}

export function analyzeRgbFrames(
  buffer,
  { width, height, fps, expectedFrames, pixelThreshold, freezeNoise },
) {
  const bytesPerFrame = width * height * 3;
  if (
    !Number.isInteger(width) ||
    width <= 0 ||
    !Number.isInteger(height) ||
    height <= 0 ||
    !Number.isFinite(fps) ||
    fps <= 0 ||
    !Number.isInteger(expectedFrames) ||
    expectedFrames <= 0 ||
    buffer.length !== bytesPerFrame * expectedFrames
  ) {
    throw new Error(
      "Decoded RGB frame count or analysis dimensions are invalid.",
    );
  }
  const noiseMatch = /^(-?\d+(?:\.\d+)?)dB$/.exec(freezeNoise);
  if (
    !noiseMatch ||
    !Number.isFinite(pixelThreshold) ||
    pixelThreshold < 0 ||
    pixelThreshold > 1
  ) {
    throw new Error(
      "Invalid black threshold or freeze noise (expected a dB value).",
    );
  }
  const noiseThreshold = 255 * 10 ** (Number(noiseMatch[1]) / 20);
  const black = [];
  const freeze = [];
  let blackStart = null;
  let freezeStart = null;
  let referenceFrame = 0;
  const interval = (startFrame, endFrame) => ({
    start: startFrame / fps,
    end: endFrame / fps,
    duration: (endFrame - startFrame) / fps,
  });
  for (let frame = 0; frame < expectedFrames; frame++) {
    const offset = frame * bytesPerFrame;
    let blackPixels = 0;
    let difference = 0;
    const referenceOffset = referenceFrame * bytesPerFrame;
    for (let p = 0; p < bytesPerFrame; p += 3) {
      const luminance =
        0.2126 * buffer[offset + p] +
        0.7152 * buffer[offset + p + 1] +
        0.0722 * buffer[offset + p + 2];
      if (luminance <= pixelThreshold * 255) blackPixels++;
      for (let channel = 0; channel < 3; channel++) {
        difference += Math.abs(
          buffer[offset + p + channel] - buffer[referenceOffset + p + channel],
        );
      }
    }
    if (blackPixels / (width * height) >= 0.98) {
      if (blackStart === null) blackStart = frame;
    } else if (blackStart !== null) {
      black.push(interval(blackStart, frame));
      blackStart = null;
    }
    if (frame === 0) continue;
    // Compare with the stationary run's anchor, not just its previous frame:
    // slow accumulating motion must not be mistaken for an indefinite freeze.
    if (difference / bytesPerFrame <= noiseThreshold) {
      if (freezeStart === null) freezeStart = referenceFrame;
    } else {
      if (freezeStart !== null) freeze.push(interval(freezeStart, frame));
      freezeStart = null;
      referenceFrame = frame;
    }
  }
  if (blackStart !== null) black.push(interval(blackStart, expectedFrames));
  if (freezeStart !== null) freeze.push(interval(freezeStart, expectedFrames));
  return { black, freeze };
}

export async function scanVideoFrames({
  videoPath,
  directory,
  fps,
  expectedFrames,
  profile,
  runFfmpeg,
}) {
  const rawPath = path.join(directory, "video-analysis.rgb");
  const width = 160;
  const height = 90;
  try {
    const result = runFfmpeg([
      "-v",
      "error",
      "-xerror",
      "-y",
      "-i",
      videoPath,
      "-map",
      "0:v:0",
      "-an",
      "-vf",
      `scale=${width}:${height}`,
      "-pix_fmt",
      "rgb24",
      "-c:v",
      "rawvideo",
      "-f",
      "image2pipe",
      rawPath,
    ]);
    if (result.status !== 0 || result.stderr.trim()) {
      throw new Error(
        result.stderr || `FFmpeg RGB decode exited ${result.status}.`,
      );
    }
    const frames = await readFile(rawPath);
    return {
      ...analyzeRgbFrames(frames, {
        width,
        height,
        fps,
        expectedFrames,
        pixelThreshold: profile.blackDetection.pixelThreshold,
        freezeNoise: profile.freezeDetection.noise,
      }),
      method: `Bundled FFmpeg decoded every frame to ${width}x${height} RGB; black >=98% pixels below configured luminance; static anchored mean RGB difference at ${profile.freezeDetection.noise}. This is a thumbnail screening measurement, not FFmpeg blackdetect/freezedetect.`,
    };
  } finally {
    await unlink(rawPath).catch((error) => {
      if (error.code !== "ENOENT") throw error;
    });
  }
}
