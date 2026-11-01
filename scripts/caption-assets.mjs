import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export function createCaptionAssets(
  source,
  { audioHash, durationSeconds, fps },
) {
  if (
    !source ||
    !Array.isArray(source.captions) ||
    !source.captions.length ||
    !Number.isFinite(source.audioDurationMs) ||
    source.audioDurationMs <= 0 ||
    !Number.isFinite(durationSeconds) ||
    !Number.isFinite(fps) ||
    fps <= 0 ||
    source.audioSha256 !== audioHash
  ) {
    throw new Error(
      "Caption source is missing, invalid, or belongs to different narration.",
    );
  }
  const roundingMs = durationSeconds * 1000 - source.audioDurationMs;
  if (roundingMs < -0.001 || roundingMs >= 1000 / fps + 0.001) {
    throw new Error(
      "Caption master duration does not match the narration-led composition.",
    );
  }
  let previousEnd = 0;
  const captions = source.captions.map((caption, index) => {
    if (
      typeof caption.text !== "string" ||
      !caption.text.trim() ||
      !Number.isFinite(caption.startMs) ||
      !Number.isFinite(caption.endMs) ||
      caption.startMs < 0 ||
      caption.endMs > source.audioDurationMs ||
      Math.round(caption.startMs) < previousEnd ||
      Math.round(caption.endMs) <= Math.round(caption.startMs)
    ) {
      throw new Error(
        `Invalid, overlapping, or out-of-range caption at cue ${index + 1}.`,
      );
    }
    previousEnd = Math.round(caption.endMs);
    return { ...caption, text: caption.text.trim().replace(/\s+/g, " ") };
  });
  const timestamp = (value) => {
    const ms = Math.round(value);
    const pad = (n, size = 2) => String(n).padStart(size, "0");
    return `${pad(Math.floor(ms / 3600000))}:${pad(Math.floor(ms / 60000) % 60)}:${pad(Math.floor(ms / 1000) % 60)}.${pad(ms % 1000, 3)}`;
  };
  const wrap = (text) => {
    const lines = [""];
    for (const word of text.split(" ")) {
      if (word.length > 42)
        throw new Error(
          "Caption contains an unbreakable word longer than 42 characters.",
        );
      const last = lines.length - 1;
      if (lines[last] && lines[last].length + word.length + 1 > 42) {
        lines.push(word);
      } else {
        lines[last] += `${lines[last] ? " " : ""}${word}`;
      }
    }
    if (lines.length > 2)
      throw new Error(
        "Caption requires more than two readable lines; split the source cue.",
      );
    return lines
      .join("\n")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  };
  const vtt = `WEBVTT\n\n${captions
    .map(
      (caption, index) =>
        `${index + 1}\n${timestamp(caption.startMs)} --> ${timestamp(caption.endMs)}\n${wrap(caption.text)}\n`,
    )
    .join("\n")}`;
  const transcript =
    captions
      .map((caption) => caption.text)
      .join(" ")
      .replace(/([.!?])\s+/g, "$1\n\n") + "\n";
  return {
    vtt,
    transcript,
    cueCount: captions.length,
    status: source.status,
    audioHash,
    lastCueEndMs: previousEnd,
  };
}

function publicAsset(root, src) {
  if (typeof src !== "string" || !src || path.isAbsolute(src)) {
    throw new Error(
      "Caption and narration sources must be public-relative paths.",
    );
  }
  const directory = path.resolve(root, "public");
  const resolved = path.resolve(directory, ...src.split("/"));
  if (!resolved.startsWith(directory + path.sep)) {
    throw new Error(
      "Caption or narration source escapes the public directory.",
    );
  }
  return resolved;
}

export async function prepareCaptionAssets(root, composition) {
  const props = composition.defaultProps;
  const source = JSON.parse(
    await readFile(publicAsset(root, props.captionSrc), "utf8"),
  );
  const audioHash = createHash("sha256")
    .update(await readFile(publicAsset(root, props.narrationSrc)))
    .digest("hex");
  return createCaptionAssets(source, {
    audioHash,
    durationSeconds: composition.durationInFrames / composition.fps,
    fps: composition.fps,
  });
}

export async function writeCaptionAssets(assets, exportPath) {
  const base = path.join(path.dirname(exportPath), path.parse(exportPath).name);
  const vtt = `${base}.vtt`;
  const transcript = `${base}.txt`;
  await writeFile(vtt, assets.vtt, "utf8");
  await writeFile(transcript, assets.transcript, "utf8");
  return { vtt, transcript };
}
