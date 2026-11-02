import { createHash } from "node:crypto";
import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

// Existing registrations retain their established review/export workflow.
const legacyIds = new Set([
  "CCIHealthInnovation-S01-Slide01",
  "RETProgramStyleProof",
  "RETProgramInformedConsent",
  "RETProgramInformedConsentProof",
  "MyComp",
  "NextLogo",
]);

export function isLegacyComposition(id) {
  return legacyIds.has(id);
}

export const approvalStates = [
  "draft",
  "awaiting-storyboard-approval",
  "storyboard-approved",
  "in-production",
  "awaiting-video-approval",
  "approved",
];

export function validateManifest(manifest, id) {
  if (typeof id !== "string" || !/^[A-Za-z0-9-]+$/.test(id) || manifest.compositionId !== id ||
      manifest.storyboardCompositionId !== `${id}-Storyboard`) {
    throw new Error("Storyboard IDs must match <ProductionId> and <ProductionId>-Storyboard.");
  }
  if (typeof manifest.concept !== "string" || !manifest.concept.trim()) {
    throw new Error("Describe the proposed visual concept.");
  }
  if (!Number.isInteger(manifest.framesPerBeat) || manifest.framesPerBeat < 1) {
    throw new Error("framesPerBeat must be a positive integer (Studio inspection only, not narration timing).");
  }
  if (!Array.isArray(manifest.beats) || manifest.beats.length < 1) {
    throw new Error("Provide meaningful visual beats; approximately 6-10 are recommended.");
  }
  const ids = new Set();
  for (const beat of manifest.beats) {
    for (const key of ["name", "narrationCue", "visual", "purpose", "transitionIntention",
      "persists", "addsOrChanges", "attentionTarget"]) {
      if (typeof beat[key] !== "string" || !beat[key].trim()) {
        throw new Error(`Each storyboard beat needs a non-empty ${key}.`);
      }
    }
    if (!Array.isArray(beat.removes) || beat.removes.some((removal) =>
      !removal || typeof removal.element !== "string" || !removal.element.trim() ||
      typeof removal.reason !== "string" || !removal.reason.trim())) {
      throw new Error("Each storyboard beat needs a removes array; every removed element needs a reason (use [] for none).");
    }
    if (ids.has(beat.name)) throw new Error(`Duplicate storyboard beat: ${beat.name}`);
    ids.add(beat.name);
  }
  return manifest;
}

async function findManifests(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await findManifests(file));
    else if (entry.name === "storyboard.config.json") files.push(file);
  }
  return files;
}

export async function findStoryboard(root, id, { required = false } = {}) {
  if (typeof id !== "string" || !/^[A-Za-z0-9-]+$/.test(id)) {
    throw new Error("Provide a production composition ID using letters, numbers and hyphens.");
  }
  if (!required && isLegacyComposition(id)) return null;
  const matches = [];
  for (const file of await findManifests(path.join(root, "src", "courses"))) {
    const manifest = JSON.parse(await readFile(file, "utf8"));
    if (manifest.compositionId === id) matches.push({ file, manifest });
  }
  if (matches.length > 1) throw new Error(`Duplicate storyboard manifests for ${id}.`);
  if (!matches.length) {
    throw new Error(`${id} requires a package-local storyboard.config.json and human storyboard approval. Storyboard IDs are not production IDs.`);
  }
  const { file, manifest } = matches[0];
  validateManifest(manifest, id);
  return {
    manifest,
    file,
    statusFile: path.join(path.dirname(file), "production-status.json"),
    output: path.join(root, "out", "storyboards", id),
  };
}

export async function readStatus(context) {
  try {
    const status = JSON.parse(await readFile(context.statusFile, "utf8"));
    if (!approvalStates.includes(status.state)) throw new Error("Invalid production approval state.");
    return status;
  } catch (error) {
    if (error.code === "ENOENT") return { state: "draft" };
    throw error;
  }
}

export async function saveStatus(context, status) {
  if (!approvalStates.includes(status.state)) throw new Error("Invalid production approval state.");
  await writeFile(context.statusFile, `${JSON.stringify(status, null, 2)}\n`);
}

export async function fileHash(file) {
  return createHash("sha256").update(await readFile(file)).digest("hex");
}

export async function productionSourceHash(root) {
  const hashes = [];
  async function visit(directory) {
    const entries = (await readdir(directory, { withFileTypes: true }))
      .sort((a, b) => a.name.localeCompare(b.name));
    for (const entry of entries) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) await visit(file);
      else if (entry.isFile() && entry.name !== "production-status.json") {
        hashes.push(`${path.relative(root, file)}:${await fileHash(file)}`);
      }
    }
  }
  await visit(path.join(root, "src"));
  await visit(path.join(root, "public"));
  return createHash("sha256").update(hashes.join("\n")).digest("hex");
}

export async function storyboardHash(context) {
  const files = [
    context.file,
    path.join(context.output, "storyboard.md"),
    path.join(context.output, "storyboard.png"),
    ...context.manifest.beats.map((_, i) => path.join(context.output, beatFilename(i))),
  ];
  const hashes = await Promise.all(files.map(fileHash));
  return createHash("sha256").update(hashes.join("\n")).digest("hex");
}

export function beatFilename(index) {
  return `beat-${String(index + 1).padStart(2, "0")}.png`;
}

export function storyboardMarkdown(manifest) {
  return `# ${manifest.compositionId} storyboard

Storyboard composition: \`${manifest.storyboardCompositionId}\`

Visual concept: ${manifest.concept}

Studio holds are inspection slots, not narration timestamps.
This is not final motion, narration synchronization, or video QA.
Approval is recorded separately in production-status.json.

${manifest.beats.map((beat, i) => `### ${i + 1}. ${beat.name}
**Narration cue:**
${beat.narrationCue}

**Visual:**
${beat.visual}

**Purpose:**
${beat.purpose}

**Transition intention:**
${beat.transitionIntention}

**Persists:**
${beat.persists}

**Adds or changes:**
${beat.addsOrChanges}

**Attention target:**
${beat.attentionTarget}

**Removes:**
${beat.removes.length ? beat.removes.map((item) => `- ${item.element}: ${item.reason}`).join("\n") : "None."}

![${beat.name}](${beatFilename(i)})
`).join("\n")}
**Awaiting human storyboard approval.**
`;
}

export async function requireStoryboardApproval(context) {
  const status = await readStatus(context);
  if (!["storyboard-approved", "in-production", "awaiting-video-approval", "approved"].includes(status.state) ||
      !status.storyboardApproval?.reviewer || !status.storyboardApproval?.notes ||
      status.storyboardApproval.hash !== await storyboardHash(context)) {
    throw new Error("Awaiting human storyboard approval. Generate/review the storyboard; only record approval following an explicit human decision.");
  }
  return status;
}

export async function approveStoryboard(context, reviewer, notes) {
  if (!reviewer?.trim() || !notes?.trim()) throw new Error("Explicit human reviewer and approval notes are required.");
  const status = await readStatus(context);
  if (status.state !== "awaiting-storyboard-approval") {
    throw new Error("Generate the storyboard before recording human storyboard approval.");
  }
  const hash = await storyboardHash(context);
  if (hash !== status.storyboardHash) throw new Error("Storyboard changed since generation; regenerate and review it.");
  await saveStatus(context, {
    state: "storyboard-approved",
    storyboardHash: hash,
    storyboardApproval: { reviewer, notes, hash, approvedAt: new Date().toISOString() },
  });
}

export async function requireApprovedVideo(context, root) {
  const status = await requireStoryboardApproval(context);
  if (status.state !== "approved" || !status.videoApproval?.reviewer ||
      !status.videoApproval?.notes || !status.videoApproval?.directory) {
    throw new Error("Awaiting human video approval. Run QA and record explicit human approval before final output.");
  }
  const directory = path.resolve(root, status.videoApproval.directory);
  const qaRoot = path.resolve(root, "out", "qa", context.manifest.compositionId) + path.sep;
  if (!directory.startsWith(qaRoot)) throw new Error("Approved video must belong to this composition's QA directory.");
  const preview = path.join(directory, "preview.mp4");
  if (status.videoApproval.hash !== await fileHash(preview) ||
      status.videoApproval.sourceHash !== await productionSourceHash(root)) {
    throw new Error("Approved video or production source changed; rerun QA and request human video approval.");
  }
  return { directory, preview };
}
