import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { getCompositions, renderStill } from "@remotion/renderer";
import { webpackOverride } from "../src/remotion/webpack-override.mjs";
import { createContactSheet } from "./video-qa-media.mjs";
import {
  approveStoryboard, beatFilename, findStoryboard, requireStoryboardApproval,
  saveStatus, storyboardHash, storyboardMarkdown,
} from "./storyboard-workflow.mjs";

const root = process.cwd();
const [id, action = "generate", reviewer, notes] = process.argv.slice(2);
const context = await findStoryboard(root, id, { required: true });

if (action === "approve") {
  await approveStoryboard(context, reviewer, notes);
  console.log("Human storyboard approval recorded. Full motion may now begin with the agreed proof of style.");
} else if (action === "start") {
  const status = await requireStoryboardApproval(context);
  if (!["storyboard-approved", "in-production"].includes(status.state)) {
    throw new Error("Regenerate and reapprove the storyboard to restart production after video review.");
  }
  await saveStatus(context, { ...status, state: "in-production" });
  console.log("In production. Implement only the human-approved visual concept.");
} else if (action === "generate") {
  // Invalidate prior approvals before rendering, including on partial failure.
  await saveStatus(context, { state: "draft" });
  await mkdir(context.output, { recursive: true });
  const serveUrl = await bundle({
    entryPoint: path.join(root, "src", "remotion", "index.ts"),
    webpackOverride,
    rspack: true,
  });
  const compositions = await getCompositions(serveUrl);
  const composition = compositions.find((item) => item.id === context.manifest.storyboardCompositionId);
  const production = compositions.find((item) => item.id === id);
  if (!composition || !production) throw new Error("Register both production and storyboard compositions explicitly in src/Root.tsx.");
  if (composition.durationInFrames !== context.manifest.framesPerBeat * context.manifest.beats.length) {
    throw new Error("Storyboard duration must equal beat count times framesPerBeat.");
  }
  if (composition.width !== production.width || composition.height !== production.height ||
      composition.fps !== production.fps) {
    throw new Error("Storyboard format must match the production composition.");
  }
  const samples = [];
  for (const [index, beat] of context.manifest.beats.entries()) {
    const frame = index * context.manifest.framesPerBeat;
    const file = path.join(context.output, beatFilename(index));
    await renderStill({ composition, serveUrl, frame, imageFormat: "png", output: file });
    samples.push({ frame, file, label: `${index + 1}. ${beat.name}` });
  }
  await createContactSheet(samples, path.join(context.output, "storyboard.png"), root);
  await writeFile(path.join(context.output, "storyboard.md"), storyboardMarkdown(context.manifest));
  await saveStatus(context, {
    state: "awaiting-storyboard-approval",
    storyboardHash: await storyboardHash(context),
  });
  console.log(`Storyboard composition: ${composition.id}
Contact sheet: ${path.join(context.output, "storyboard.png")}
Markdown: ${path.join(context.output, "storyboard.md")}
Visual beats: ${context.manifest.beats.length}
Visual concept: ${context.manifest.concept}

Awaiting human storyboard approval.
STOP. No full motion implementation, QA, or MP4 export has been started.`);
} else {
  throw new Error("Usage: npm run storyboard -- <ProductionId> [generate|approve|start] [human-reviewer] [approval-notes]");
}
