import { expect, test } from "@playwright/test";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Caption } from "@remotion/captions";
import analysis from "../src/courses/cci-health-innovation/section-01-slide-02/audio-analysis.json";
import source from "../public/courses/cci-health-innovation/section-01-slide-02/closed-captions.json";
import { getSlide02Timing, slide02PropsSchema } from "../src/courses/cci-health-innovation/section-01-slide-02/timing";
import { slide02Config as config } from "../src/courses/cci-health-innovation/section-01-slide-02/video.config";

test.describe("CCI Slide 2 narration-led production", () => {
  test.skip(process.env.RETPROGRAM_QA_COMPOSITION_ID !== config.id,
    "Opt-in Slide 2 production checks.");

  const props = slide02PropsSchema.parse({
    sceneDurations: {}, narrationSrc: config.narrationSrc, captionSrc: config.captionSrc, showCaptions: false,
  });
  const timing = getSlide02Timing(props);

  test("master samples, unequal phrase cues and sidecars agree", async () => {
    expect(config.audioDurationSeconds).toBe(analysis.decodedSampleCount / analysis.decodedSampleRate);
    expect(timing.durationInFrames).toBe(1776);
    expect(config.durationInFrames / config.fps - config.audioDurationSeconds).toBeLessThan(1 / config.fps);
    expect(config.durationInFrames / config.fps).toBeGreaterThanOrEqual(config.audioDurationSeconds);
    for (const [index, cue] of analysis.cues.filter((cue) => cue.pose !== "summary").entries()) {
      expect(timing.scenes[index].from).toBe(cue.frame);
      if (index) expect(Math.abs(cue.frame / config.fps - cue.seconds)).toBeLessThanOrEqual(0.5 / config.fps);
    }
    expect(timing.scenes.slice(3, 7).map((scene) => scene.end - scene.from)).toEqual([68, 46, 35, 62]);
    expect(timing.scenes).toHaveLength(9);
    expect(timing.scenes.at(-1)).toEqual({ pose: "voices", from: 1406, end: 1776 });
    for (const cue of analysis.subCues) expect(timing.subCue(cue.name)).toBe(cue.frame);
    expect(slide02PropsSchema.safeParse({ ...props, showCaptions: true }).success).toBe(false);
    expect(slide02PropsSchema.safeParse({ ...props,
      sceneDurations: { ...props.sceneDurations, voices: 371 } }).success).toBe(false);
    const audio = await readFile(path.resolve("public", config.narrationSrc));
    expect(createHash("sha256").update(Uint8Array.from(audio)).digest("hex")).toBe(source.audioSha256);
    const captions: Caption[] = source.captions;
    expect(captions).toHaveLength(25);
    let end = 0;
    for (const caption of captions) {
      expect(caption.startMs).toBeGreaterThanOrEqual(end);
      expect(caption.endMs).toBeGreaterThan(caption.startMs);
      expect(caption.endMs).toBeLessThanOrEqual(config.audioDurationSeconds * 1000);
      end = caption.endMs;
    }
    const base = path.resolve("out", "captions", config.id, config.id);
    const vtt = await readFile(`${base}.vtt`, "utf8");
    const transcript = await readFile(`${base}.txt`, "utf8");
    expect(vtt.startsWith("WEBVTT\n")).toBe(true);
    expect(vtt.match(/ --> /g)).toHaveLength(captions.length);
    expect(transcript.replace(/\s+/g, " ").trim()).toBe(captions.map((cue) => cue.text).join(" "));
  });

  test("Studio preserves anchors, clean frames and readable phrase-led states", async ({ page }) => {
    test.setTimeout(240_000);
    const errors: string[] = [];
    const seekCancellations: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("requestfailed", (request) => {
      const failure = `${request.url()}: ${request.failure()?.errorText}`;
      if (request.failure()?.errorText === "net::ERR_ABORTED" &&
        request.url().endsWith(config.narrationSrc)) seekCancellations.push(failure);
      else errors.push(failure);
    });
    page.on("response", (response) => {
      if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
    });
    const audioRequest = page.waitForRequest((request) => request.url().endsWith(config.narrationSrc));
    await page.goto(`/${config.id}`);
    const audio = await page.request.get((await audioRequest).url());
    expect(audio.ok()).toBe(true);
    expect(createHash("sha256").update(Uint8Array.from(await audio.body())).digest("hex")).toBe(analysis.sha256);
    const stage = page.locator(".remotion-studio-composition-container");
    await expect(stage).toBeVisible();
    const readout = (frame: number) => page.getByRole("button", { name: String(frame), exact: true })
      .and(page.locator("button[aria-label]"));
    let current = 0;
    await expect(readout(0)).toBeVisible();
    await stage.locator("[data-persistent]").evaluateAll((elements) => {
      elements.forEach((element, index) => element.setAttribute("data-continuity-token", String(index)));
    });
    const anchors = () => stage.locator("[data-persistent]").evaluateAll((elements) =>
      elements.map((element) => ({
        name: element.getAttribute("data-persistent"), token: element.getAttribute("data-continuity-token"),
        geometry: ["cx", "cy", "r", "x", "y", "width", "height", "d"].map((key) => element.getAttribute(key)),
      })));
    const initialAnchors = await anchors();
    const frames = [...new Set([0, 1775,
      ...timing.scenes.flatMap((scene) => [scene.from, scene.from + 1, scene.from + 20, scene.end - 1]),
      ...analysis.subCues.flatMap((cue) => [cue.frame, cue.frame + 12]),
    ])].sort((a, b) => a - b);
    const checks = [];
    for (const frame of frames) {
      if (frame !== current) {
        await readout(current).click();
        const input = page.getByRole("textbox");
        await input.fill(String(frame));
        await input.press("Enter");
        await expect(readout(frame)).toBeVisible();
        current = frame;
      }
      const expected = timing.scenes.find((scene) => frame >= scene.from && frame < scene.end)!;
      await expect(stage.locator(`[data-slide02-pose="${expected.pose}"]`)).toHaveCount(1);
      await expect(stage.locator("[data-cci-captions]")).toHaveCount(0);
      await expect(stage).not.toContainText("STORYBOARD ONLY");
      await expect(stage).not.toContainText("CCI in Health Innovation");
      await expect(stage).not.toContainText("Section 1 / Who is a consumer?");
      await expect(stage).not.toContainText("RETPROGRAM");
      await expect(stage).not.toContainText("STORYBOARD");
      await expect(stage.locator("[data-cci-eyebrow]")).toHaveCount(0);
      await expect(stage.locator("[data-cci-text='slide02-title']")).toHaveText("Who is a consumer in this context?");
      expect(await anchors()).toEqual(initialAnchors);
      const stateIndex = timing.scenes.indexOf(expected);
      await expect(stage.locator("[data-contribution][data-revealed='true']")).toHaveCount(
        Math.max(0, Math.min(4, stateIndex - 2)));
      const heading = stage.locator("[data-voices-heading]");
      if (frame < 1406) await expect(stage.locator("[data-voices-extension]")).toBeHidden();
      if (frame >= 1424) await expect(heading).toHaveCSS("opacity", "1");
      for (const [index, cue] of ["concept", "designImplementation", "delivery"].entries()) {
        const label = stage.locator("[data-stage-label]").nth(index);
        const from = timing.subCue(cue as "concept" | "designImplementation" | "delivery");
        if (frame < from) await expect(label).toHaveCSS("opacity", "0");
        if (frame >= from + 12) await expect(label).toHaveCSS("opacity", "1");
      }
      const findings = await stage.evaluate((container) => {
        const bounds = container.getBoundingClientRect();
        const scale = bounds.width / 1920;
        const rects: { text: string; left: number; right: number; top: number; bottom: number }[] = [];
        const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
        let node = walker.nextNode();
        while (node) {
          let parent = node.parentElement;
          let visible = Boolean(parent && !parent.closest("svg") && node.textContent?.trim());
          while (parent && parent !== container && visible) {
            const style = getComputedStyle(parent);
            visible = style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) >= 0.05;
            parent = parent.parentElement;
          }
          if (visible) {
            const range = document.createRange();
            range.selectNodeContents(node);
            for (const rect of Array.from(range.getClientRects())) {
              if (rect.width && rect.height) rects.push({
                text: node.textContent!.trim(), left: (rect.left - bounds.left) / scale,
                right: (rect.right - bounds.left) / scale,
                top: (rect.top - bounds.top) / scale, bottom: (rect.bottom - bounds.top) / scale,
              });
            }
          }
          node = walker.nextNode();
        }
        return {
          outside: rects.filter((r) => r.left < 90 || r.right > 1830 || r.top < 50 || r.bottom > 1028),
          overlaps: rects.flatMap((r, index) => rects.slice(index + 1)
            .filter((b) => r.left < b.right - 1 && r.right > b.left + 1 &&
              r.top < b.bottom - 1 && r.bottom > b.top + 1).map((b) => [r.text, b.text])),
          anchor: container.querySelector("[data-persistent='experience']")?.getAttribute("cy"),
          titleTop: (container.querySelector("[data-cci-text='slide02-title']")!.getBoundingClientRect().top - bounds.top) / scale,
          titleOpacity: Number(getComputedStyle(container.querySelector("[data-cci-text='slide02-title']")!).opacity),
          connection: container.querySelector("[data-persistent='connector']")?.getAttribute("stroke-dasharray"),
          fontLoaded: document.fonts.check("600 29px Inter"),
        };
      });
      expect(findings.outside, `frame ${frame}: safe text`).toEqual([]);
      expect(findings.overlaps, `frame ${frame}: text overlap`).toEqual([]);
      expect(findings.anchor).toBe("545");
      expect(findings.fontLoaded).toBe(true);
      expect(findings.titleTop).toBeCloseTo(72, 0);
      expect(findings.titleOpacity).toBe(1);
      if (expected.pose === "separate" && frame >= expected.from + 20) expect(findings.connection).toBe("10 10");
      if (stateIndex >= 2 && frame >= expected.from + 20) expect(findings.connection).toBeNull();
      checks.push({ frame, pose: expected.pose, findings });
    }
    expect(errors).toEqual([]);
    await writeFile(path.join(path.dirname(process.env.RETPROGRAM_QA_SCREENSHOT!), "slide02-layout.json"),
      JSON.stringify({ errors, seekCancellations, checks }, null, 2));
  });
});
