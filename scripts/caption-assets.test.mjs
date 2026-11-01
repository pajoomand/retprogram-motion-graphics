import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { URL } from "node:url";
import { createCaptionAssets } from "./caption-assets.mjs";

const source = JSON.parse(
  await readFile(
    new URL(
      "../public/courses/cci-health-innovation/section-01-slide-01/closed-captions.json",
      import.meta.url,
    ),
    "utf8",
  ),
);
const options = {
  audioHash: source.audioSha256,
  durationSeconds: 1180 / 30,
  fps: 30,
};

test("VTT preserves all 16 measured cues and transcript wording", () => {
  const result = createCaptionAssets(source, options);
  assert.equal(result.cueCount, 16);
  assert.ok(
    result.vtt.startsWith("WEBVTT\n\n1\n00:00:00.100 --> 00:00:02.200\n"),
  );
  assert.ok(result.vtt.includes("00:00:36.840 --> 00:00:39.063"));
  assert.equal((result.vtt.match(/ --> /g) || []).length, 16);
  assert.equal(
    result.transcript.replace(/\s+/g, " ").trim(),
    source.captions.map((c) => c.text).join(" "),
  );
  for (const line of result.vtt
    .split("\n")
    .filter(
      (line) =>
        line &&
        !/^\d+$/.test(line) &&
        !line.includes("-->") &&
        line !== "WEBVTT",
    )) {
    assert.ok(line.length <= 42, line);
  }
});

test("different narration or incompatible composition duration is rejected", () => {
  assert.throws(
    () => createCaptionAssets(source, { ...options, audioHash: "wrong" }),
    /different narration/,
  );
  assert.throws(
    () => createCaptionAssets(source, { ...options, durationSeconds: 40 }),
    /duration/,
  );
});

test("overlapping, reversed and out-of-range cues are rejected", () => {
  for (const patch of [{ startMs: -1 }, { startMs: 2200 }, { endMs: 50000 }]) {
    const changed = JSON.parse(JSON.stringify(source));
    Object.assign(changed.captions[0], patch);
    assert.throws(() => createCaptionAssets(changed, options), /cue 1/);
  }
  const changed = JSON.parse(JSON.stringify(source));
  changed.captions[1].startMs = 2199;
  assert.throws(() => createCaptionAssets(changed, options), /cue 2/);
});

test("cue text is escaped for WebVTT without changing plain transcript", () => {
  const changed = JSON.parse(JSON.stringify(source));
  changed.captions[0].text = "Treatment & outcomes <review>";
  const result = createCaptionAssets(changed, options);
  assert.ok(result.vtt.includes("Treatment &amp; outcomes &lt;review&gt;"));
  assert.ok(result.transcript.includes("Treatment & outcomes <review>"));
});
