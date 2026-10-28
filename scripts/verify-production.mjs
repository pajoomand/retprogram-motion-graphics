import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { getCompositions, renderFrames, renderMedia } from "@remotion/renderer";
import { webpackOverride } from "../src/remotion/webpack-override.mjs";

const mode = process.argv[2];
assert.ok(
  mode === "baseline" || mode === "verify",
  "Usage: node scripts\\verify-production.mjs baseline|verify [output-directory]",
);
const directory = path.resolve(process.argv[3] ?? "out\\migration-qa");
const baselineFile = path.join(directory, "baseline.json");
const reference =
  mode === "verify"
    ? JSON.parse(await readFile(baselineFile, "utf8"))
    : null;
await mkdir(directory, { recursive: true });
const serveUrl = await bundle({
  entryPoint: path.resolve("src\\remotion\\index.ts"),
  webpackOverride,
  rspack: true,
});
const compositions = await getCompositions(serveUrl);
const metadata = compositions.map(
  ({ id, width, height, fps, durationInFrames, props, defaultProps }) => ({
    id,
    width,
    height,
    fps,
    durationInFrames,
    props,
    defaultProps,
  }),
);
if (reference) {
  assert.deepEqual(metadata, reference.metadata, "Composition metadata changed");
}
const hashes = {};
for (const composition of compositions) {
  console.log(`${mode}: ${composition.id} (${composition.durationInFrames} frames)`);
  const frames = {};
  const samples = new Set([
    0, 90, 179, 180, 269, 360, 449, 450, 539, 600, 719, 720, 810,
    composition.durationInFrames - 1,
  ]);
  await renderFrames({
    composition,
    serveUrl,
    outputDir: null,
    inputProps: {},
    imageFormat: "png",
    concurrency: 2,
    onStart: () => {},
    onFrameUpdate: (count) => {
      if (count % 150 === 0) console.log(`  ${count} frames`);
    },
    onFrameBuffer: async (buffer, frame) => {
      frames[frame] = createHash("sha256").update(buffer).digest("hex");
      if (samples.has(frame)) {
        await writeFile(
          path.join(directory, `${mode}-${composition.id}-${frame}.png`),
          buffer,
        );
      }
    },
  });
  assert.equal(Object.keys(frames).length, composition.durationInFrames);
  if (reference) {
    assert.deepEqual(
      frames,
      reference.hashes[composition.id],
      `Rendered PNG frames changed: ${composition.id}`,
    );
    await renderMedia({
      composition,
      serveUrl,
      codec: "h264",
      imageFormat: "jpeg",
      concurrency: 2,
      outputLocation: path.join(directory, `${composition.id}.mp4`),
      overwrite: false,
    });
    console.log(`  All frames identical; MP4 export passed`);
  }
  hashes[composition.id] = frames;
}
await writeFile(
  mode === "baseline" ? baselineFile : path.join(directory, "verification.json"),
  JSON.stringify({ metadata, hashes }, null, 2),
  { flag: "wx" },
);
console.log(`${mode}: PASS (${compositions.length} compositions)`);
