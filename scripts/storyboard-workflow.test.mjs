import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import {
  approvalStates, approveStoryboard, beatFilename, fileHash, findStoryboard,
  isLegacyComposition, productionSourceHash, readStatus, requireApprovedVideo,
  requireStoryboardApproval, saveStatus,
  storyboardHash, storyboardMarkdown, validateManifest,
} from "./storyboard-workflow.mjs";

const root = process.cwd();
const id = "Workflow-Test";
const manifest = {
  compositionId: id,
  storyboardCompositionId: `${id}-Storyboard`,
  concept: "Test-only neutral shapes; not teaching content.",
  framesPerBeat: 60,
  beats: Array.from({ length: 6 }, (_, index) => ({
    name: `Visual beat ${index + 1}`,
    narrationCue: "Fixture only; no supplied narration.",
    visual: "A neutral rectangle using a shared static scene.",
    purpose: "Exercise the workflow without changing any course.",
    transitionIntention: "Change the rectangle width in the next state.",
    persists: "The rectangle and stable teaching title.",
    addsOrChanges: "The rectangle grows without re-entering.",
    attentionTarget: "The changed rectangle edge.",
    removes: [],
  })),
};

async function fixture(t) {
  await mkdir(path.join(root, "out"), { recursive: true });
  const directory = await mkdtemp(path.join(root, "out", "storyboard-test-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const packageDir = path.join(directory, "src", "courses", "test", "video");
  await mkdir(packageDir, { recursive: true });
  await mkdir(path.join(directory, "public"), { recursive: true });
  await writeFile(path.join(packageDir, "storyboard.config.json"), JSON.stringify(manifest));
  return { directory, packageDir, context: await findStoryboard(directory, id) };
}

function cli(directory, script, args) {
  return spawnSync(process.execPath, [path.join(root, "scripts", script), ...args], {
    cwd: directory,
    encoding: "utf8",
    timeout: 180_000,
    maxBuffer: 8 * 1024 * 1024,
  });
}

async function generatedArtifacts(context) {
  await mkdir(context.output, { recursive: true });
  await writeFile(path.join(context.output, "storyboard.md"), storyboardMarkdown(manifest));
  await writeFile(path.join(context.output, "storyboard.png"), "contact sheet fixture");
  for (const [index] of manifest.beats.entries()) {
    await writeFile(path.join(context.output, beatFilename(index)), `frame fixture ${index}`);
  }
  await saveStatus(context, {
    state: "awaiting-storyboard-approval",
    storyboardHash: await storyboardHash(context),
  });
}

test("manifest validates IDs, narrative fields, beat names and inspection slots", () => {
  assert.equal(validateManifest(manifest, id), manifest);
  assert.throws(() => validateManifest({ ...manifest, storyboardCompositionId: id }, id), /IDs/);
  assert.throws(() => validateManifest({ ...manifest, framesPerBeat: 0 }, id), /positive/);
  assert.throws(() => validateManifest({ ...manifest, beats: [] }, id), /meaningful/);
  assert.throws(() => validateManifest({ ...manifest, beats: [{ name: "x" }] }, id), /narrationCue/);
  assert.throws(() => validateManifest({ ...manifest, beats: [manifest.beats[0], manifest.beats[0]] }, id), /Duplicate/);
  assert.equal(approvalStates.length, 6);
  assert.equal(isLegacyComposition("CCIHealthInnovation-S01-Slide01"), true);
  assert.equal(isLegacyComposition(id), false);
  for (const key of ["persists", "addsOrChanges", "attentionTarget"]) {
    assert.throws(() => validateManifest({ ...manifest, beats: [{ ...manifest.beats[0], [key]: "" }] }, id), new RegExp(key));
  }
  assert.throws(() => validateManifest({ ...manifest, beats: [{ ...manifest.beats[0], removes: undefined }] }, id), /removes array/);
  assert.throws(() => validateManifest({ ...manifest, beats: [{ ...manifest.beats[0],
    removes: [{ element: "Old label", reason: "" }] }] }, id), /reason/);
});

test("unknown/new IDs cannot silently use legacy exemptions", async (t) => {
  const { directory } = await fixture(t);
  assert.equal(await findStoryboard(directory, "CCIHealthInnovation-S01-Slide01"), null);
  await assert.rejects(findStoryboard(directory, "New-Video"), /requires/);
  await assert.rejects(findStoryboard(directory, `${id}-Storyboard`), /requires/);
  await assert.rejects(findStoryboard(directory, "..\\escape"), /Provide/);
  await assert.rejects(findStoryboard(directory, undefined), /Provide/);
});

test("approval requires generated artifacts, explicit reviewer/notes and unchanged revision", async (t) => {
  const { context } = await fixture(t);
  assert.equal((await readStatus(context)).state, "draft");
  await assert.rejects(requireStoryboardApproval(context), /Awaiting human/);
  await assert.rejects(approveStoryboard(context, "Reviewer", "Approved"), /Generate/);
  await generatedArtifacts(context);
  await assert.rejects(approveStoryboard(context, "", "Approved"), /reviewer/);
  await assert.rejects(approveStoryboard(context, "Reviewer", ""), /notes/);
  await approveStoryboard(context, "Reviewer", "Human explicitly approved this revision");
  assert.equal((await requireStoryboardApproval(context)).state, "storyboard-approved");
  await writeFile(path.join(context.output, "beat-01.png"), "changed");
  await assert.rejects(requireStoryboardApproval(context), /Awaiting human/);
  await saveStatus(context, { state: "draft" });
  await assert.rejects(requireStoryboardApproval(context), /Awaiting human/);
});

test("stale generated revision cannot be approved and invalid state fails", async (t) => {
  const { context } = await fixture(t);
  await generatedArtifacts(context);
  await writeFile(path.join(context.output, "storyboard.md"), "changed");
  await assert.rejects(approveStoryboard(context, "Reviewer", "Approved"), /changed/);
  await assert.rejects(saveStatus(context, { state: "made-up" }), /Invalid/);
});

test("Markdown contains semantic beats and no invented narration timestamps", () => {
  const markdown = storyboardMarkdown(manifest);
  for (const field of ["Narration cue", "Visual", "Purpose", "Transition intention",
    "Persists", "Adds or changes", "Attention target", "Removes"]) {
    assert.equal(markdown.split(`**${field}:**`).length - 1, 6);
  }
  assert.match(markdown, /Awaiting human storyboard approval/);
  assert.match(markdown, /not narration timestamps/);
  assert.doesNotMatch(markdown, /\d+:\d\d/);
  const withRemoval = storyboardMarkdown({ ...manifest, beats: [{ ...manifest.beats[0],
    removes: [{ element: "Old label", reason: "Replaced by a more precise relationship." }] }] });
  assert.match(withRemoval, /Old label: Replaced by a more precise relationship/);
});

test("source fingerprint invalidates video approval on source/media edits but not status changes", async (t) => {
  const { directory, context } = await fixture(t);
  const before = await productionSourceHash(directory);
  await saveStatus(context, { state: "draft" });
  assert.equal(await productionSourceHash(directory), before);
  await writeFile(path.join(directory, "public", "asset.txt"), "changed media");
  assert.notEqual(await productionSourceHash(directory), before);
});

test("final-output gate binds human video approval to the reviewed MP4, source and composition", async (t) => {
  const { directory, context } = await fixture(t);
  await generatedArtifacts(context);
  await approveStoryboard(context, "Reviewer", "Approved storyboard");
  await assert.rejects(requireApprovedVideo(context, directory), /Awaiting human video approval/);
  const qa = path.join(directory, "out", "qa", id, "reviewed-run");
  await mkdir(qa, { recursive: true });
  const preview = path.join(qa, "preview.mp4");
  await writeFile(preview, "test-only video bytes");
  const status = await readStatus(context);
  const approved = {
    ...status,
    state: "approved",
    videoApproval: {
      reviewer: "Human",
      notes: "Explicit video approval",
      directory: path.relative(directory, qa),
      hash: await fileHash(preview),
      sourceHash: await productionSourceHash(directory),
    },
  };
  await saveStatus(context, approved);
  assert.equal((await requireApprovedVideo(context, directory)).preview, preview);
  await writeFile(preview, "changed video");
  await assert.rejects(requireApprovedVideo(context, directory), /changed/);
  await writeFile(preview, "test-only video bytes");
  await writeFile(path.join(directory, "public", "changed.txt"), "changed source");
  await assert.rejects(requireApprovedVideo(context, directory), /changed/);
  await saveStatus(context, {
    ...approved,
    videoApproval: { ...approved.videoApproval, directory: "..\\elsewhere" },
  });
  await assert.rejects(requireApprovedVideo(context, directory), /this composition/);
});

test("production rendering is blocked before storyboard approval and start", async (t) => {
  const { directory, context } = await fixture(t);
  await mkdir(path.join(directory, "scripts"), { recursive: true });
  await writeFile(path.join(directory, "scripts", "qa-profiles.json"),
    await readFile(path.join(root, "scripts", "qa-profiles.json")));
  for (const mode of ["render", "run", "export"]) {
    const result = cli(directory, "video-qa.mjs", [mode, id]);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Awaiting human storyboard approval/);
  }
  await generatedArtifacts(context);
  await approveStoryboard(context, "Reviewer", "Explicit approval");
  const result = cli(directory, "video-qa.mjs", ["run", id]);
  assert.match(result.stderr, /production start/);
  const exported = cli(directory, "video-qa.mjs", ["export", id, "out\\final.mp4"]);
  assert.match(exported.stderr, /Awaiting human video approval/);
  const direct = cli(directory, "render-video.mjs", [id, "out\\final.mp4"]);
  assert.match(direct.stderr, /Direct production export is disabled/);
});

test("QA approval command records only the pending, unchanged human-reviewed video revision", async (t) => {
  const { directory, context } = await fixture(t);
  await mkdir(path.join(directory, "scripts"), { recursive: true });
  await writeFile(path.join(directory, "scripts", "qa-profiles.json"),
    await readFile(path.join(root, "scripts", "qa-profiles.json")));
  await generatedArtifacts(context);
  await approveStoryboard(context, "Reviewer", "Approved storyboard");
  const qa = path.join(directory, "out", "qa", id, "reviewed-run");
  await mkdir(qa, { recursive: true });
  const preview = path.join(qa, "preview.mp4");
  await writeFile(preview, "fixture only: no production video");
  const status = await readStatus(context);
  await saveStatus(context, {
    ...status,
    state: "awaiting-video-approval",
    videoReview: {
      directory: path.relative(directory, qa).split(path.sep).join("/"),
      hash: await fileHash(preview),
      sourceHash: await productionSourceHash(directory),
    },
  });
  const report = {
    compositionId: id,
    course: "Test fixture",
    video: "Test-only review",
    technicalStatus: "failed",
    checks: [],
    issues: [],
    correctionAttempts: [],
    render: { width: 1920, height: 1080, fps: 30, expectedDurationSeconds: 1 },
  };
  await writeFile(path.join(qa, "report.json"), JSON.stringify(report));
  const failed = cli(directory, "video-qa.mjs", ["approve", id, qa, "Human", "Approved"]);
  assert.match(failed.stderr, /technical checks have failed/);
  report.technicalStatus = "passed";
  await writeFile(path.join(qa, "report.json"), JSON.stringify(report));
  const noReviewer = cli(directory, "video-qa.mjs", ["approve", id, qa, "", "Approved"]);
  assert.match(noReviewer.stderr, /reviewer name/);
  await writeFile(preview, "modified");
  const changed = cli(directory, "video-qa.mjs", ["approve", id, qa, "Human", "Approved"]);
  assert.match(changed.stderr, /current production source/);
  await writeFile(preview, "fixture only: no production video");
  const approved = cli(directory, "video-qa.mjs", ["approve", id, qa, "Human", "Explicit human video approval"]);
  assert.equal(approved.status, 0, approved.stderr);
  assert.equal((await readStatus(context)).state, "approved");
  assert.equal((await requireApprovedVideo(context, directory)).preview, preview);
  const noOutput = cli(directory, "video-qa.mjs", ["export", id]);
  assert.match(noOutput.stderr, /export path/);
  const outsideOutput = cli(directory, "video-qa.mjs", ["export", id, "not-ignored.mp4"]);
  assert.match(outsideOutput.stderr, /ignored out directory/);
});

test("real Remotion storyboard generates only six PNG states plus labelled sheet and stops", async (t) => {
  const { directory, context } = await fixture(t);
  const entryDir = path.join(directory, "src", "remotion");
  await mkdir(entryDir, { recursive: true });
  const helper = path.relative(entryDir, path.join(root, "src", "shared", "storyboard", "Storyboard"))
    .split(path.sep).join("/");
  await writeFile(path.join(entryDir, "index.ts"), `
import React from "react";
import {registerRoot, Composition, AbsoluteFill} from "remotion";
import {Storyboard} from ${JSON.stringify(helper)};
const Scene = ({index}: {index: number}) => React.createElement(AbsoluteFill,
  {style: {background: "#F6F4EE", padding: 100}},
  React.createElement("div", {style: {background: "#18313D", width: 100 + index * 80, height: 100}}));
const Board = () => React.createElement(Storyboard, {framesPerBeat: 60,
  states: Array.from({length: 6}, (_, i) => ({name: "Beat " + (i + 1), visual: React.createElement(Scene, {index: i})}))});
const Root = () => React.createElement(React.Fragment, null,
  React.createElement(Composition, {id: "${id}", component: Scene, durationInFrames: 900, fps: 30, width: 1920, height: 1080}),
  React.createElement(Composition, {id: "${id}-Storyboard", component: Board, durationInFrames: 360, fps: 30, width: 1920, height: 1080}));
registerRoot(Root);
`);
  const result = cli(directory, "storyboard.mjs", [id]);
  assert.equal(result.status, 0, `${result.error ?? ""}\n${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /Visual beats: 6/);
  assert.match(result.stdout, /Awaiting human storyboard approval/);
  const files = await readdir(context.output);
  assert.deepEqual(files.sort(), [
    ...manifest.beats.map((_, i) => beatFilename(i)), "storyboard.md", "storyboard.png",
  ].sort());
  for (const file of files.filter((name) => name.endsWith(".png"))) {
    const png = await readFile(path.join(context.output, file));
    assert.equal(png.subarray(1, 4).toString(), "PNG");
    if (file !== "storyboard.png") {
      assert.equal(png.readUInt32BE(16), 1920);
      assert.equal(png.readUInt32BE(20), 1080);
    }
  }
  assert.notEqual(await fileHash(path.join(context.output, "beat-01.png")),
    await fileHash(path.join(context.output, "beat-06.png")));
  assert.equal((await readStatus(context)).state, "awaiting-storyboard-approval");
  const approved = cli(directory, "storyboard.mjs", [id, "approve", "Reviewer", "Explicit human decision"]);
  assert.equal(approved.status, 0, approved.stderr);
  const started = cli(directory, "storyboard.mjs", [id, "start"]);
  assert.equal(started.status, 0, started.stderr);
  assert.equal((await readStatus(context)).state, "in-production");
  const regenerated = cli(directory, "storyboard.mjs", [id]);
  assert.equal(regenerated.status, 0, regenerated.stderr);
  assert.equal((await readStatus(context)).state, "awaiting-storyboard-approval");
  await assert.rejects(requireStoryboardApproval(context), /Awaiting human/);
  await approveStoryboard(context, "Reviewer", "Approve regenerated storyboard");
  const entryFile = path.join(entryDir, "index.ts");
  const entry = await readFile(entryFile, "utf8");
  await writeFile(entryFile, entry.replace('durationInFrames: 360', 'durationInFrames: 359'));
  const failed = cli(directory, "storyboard.mjs", [id]);
  assert.notEqual(failed.status, 0);
  assert.match(failed.stderr, /duration must equal/);
  assert.equal((await readStatus(context)).state, "draft");
  await assert.rejects(requireStoryboardApproval(context), /Awaiting human/);
});
