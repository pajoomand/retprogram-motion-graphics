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
    expect(timing.durationInFrames).toBe(1720);
    expect(config.durationInFrames / config.fps - config.audioDurationSeconds).toBeLessThan(1 / config.fps);
    expect(config.durationInFrames / config.fps).toBeGreaterThanOrEqual(config.audioDurationSeconds);
    for (const [index, cue] of analysis.cues.filter((cue) => cue.pose !== "summary").entries()) {
      expect(timing.scenes[index].from).toBe(cue.frame);
      if (index) expect(Math.abs(cue.frame / config.fps - cue.seconds)).toBeLessThanOrEqual(0.5 / config.fps);
    }
    expect(timing.scenes.slice(3, 7).map((scene) => scene.end - scene.from)).toEqual([65, 47, 37, 69]);
    expect(timing.scenes).toHaveLength(9);
    expect(timing.scenes.at(-1)).toEqual({ pose: "voices", from: 1368, end: 1720 });
    expect(timing.durationInFrames - (timing.subCue("delivery") + 18)).toBe(89);
    for (const cue of analysis.subCues) expect(timing.subCue(cue.name)).toBe(cue.frame);
    expect(slide02PropsSchema.safeParse({ ...props, showCaptions: true }).success).toBe(false);
    expect(slide02PropsSchema.safeParse({ ...props,
      sceneDurations: { ...props.sceneDurations, voices: 353 } }).success).toBe(false);
    const audio = await readFile(path.resolve("public", config.narrationSrc));
    expect(createHash("sha256").update(Uint8Array.from(audio)).digest("hex")).toBe(source.audioSha256);
    const selected = await readFile(path.resolve("public", "audio", "cci-health-innovation",
      "section-01", "s01-slide02-temp-narration.mp3"));
    expect(audio.equals(Uint8Array.from(selected))).toBe(true);
    const captions: Caption[] = source.captions;
    expect(captions).toHaveLength(24);
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
    let settledAnchors: Awaited<ReturnType<typeof anchors>> | undefined;
    const expansionStart = timing.scenes[1].from;
    const frames = [...new Set([0, config.durationInFrames - 1,
      ...[12, 18, 30, 42, 48, 68].map((offset) => expansionStart + offset),
      ...timing.scenes.flatMap((scene) => [scene.from, scene.from + 1, scene.from + 20, scene.end - 1]),
      ...analysis.subCues.flatMap((cue) => [cue.frame, cue.frame + 12]),
    ])].sort((a, b) => a - b);
    const checks = [];
    let expertiseContent = "";
    let expertiseLayout = "";
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
      const currentAnchors = await anchors();
      expect(currentAnchors.map(({ name, token }) => ({ name, token }))).toEqual(
        initialAnchors.map(({ name, token }) => ({ name, token })));
      const circle = stage.locator("[data-persistent='experience']");
      const x = Number(await circle.getAttribute("cx"));
      const y = Number(await circle.getAttribute("cy"));
      expect(x).toBeGreaterThanOrEqual(360);
      expect(x).toBeLessThanOrEqual(960);
      expect(y).toBeGreaterThanOrEqual(545);
      expect(y).toBeLessThanOrEqual(590);
      if (frame <= expansionStart) {
        expect(x).toBe(960);
        expect(y).toBe(590);
        await expect(stage.locator("[data-persistent='workspace']")).toBeHidden();
        await expect(stage.locator("[data-opening-expertise]")).toHaveCSS("opacity", "1");
      }
      if (frame === expansionStart + 1) {
        expect(960 - x).toBeGreaterThan(0);
        expect(960 - x).toBeLessThan(5);
      }
      if (frame >= expansionStart + 42) {
        expect(x).toBe(360);
        expect(y).toBe(545);
        if (!settledAnchors) settledAnchors = currentAnchors;
        expect(currentAnchors).toEqual(settledAnchors);
        await expect(stage.locator("[data-opening-expertise]")).toHaveCSS("opacity", "0");
      }
      if (frame <= expansionStart + 30) {
        await expect(stage.locator("[data-workspace-content]")).toHaveCSS("opacity", "0");
      }
      if (frame >= expansionStart + 48 && frame < timing.scenes[7].from) {
        await expect(stage.locator("[data-workspace-content]")).toHaveCSS("opacity", "1");
      }
      const stateIndex = timing.scenes.indexOf(expected);
      const patientSupport = stage.locator("[data-patient-carer-support]");
      await expect(patientSupport).toHaveText("Including patients and carers");
      if (frame <= timing.scenes[2].from) await expect(patientSupport).toHaveCSS("opacity", "1");
      if (frame > timing.scenes[2].from && frame < timing.scenes[2].from + 18) {
        const opacity = Number(await patientSupport.evaluate((element) => getComputedStyle(element).opacity));
        expect(opacity).toBeGreaterThan(0);
        expect(opacity).toBeLessThan(1);
      }
      if (frame >= timing.scenes[2].from + 18) await expect(patientSupport).toHaveCSS("opacity", "0");
      await expect(stage.locator("[data-contribution][data-revealed='true']")).toHaveCount(
        Math.max(0, Math.min(4, stateIndex - 2)));
      const heading = stage.locator("[data-voices-heading]");
      if (frame >= Math.max(timing.subCue("realisticPerspective"), timing.subCue("technicalExpertise")) + 18) {
        const callout = stage.locator("[data-expertise]");
        await expect(callout.getByText("Technical expertise not required", { exact: true })).toBeVisible();
        const content = await callout.innerHTML();
        const layout = await callout.evaluate((element) => {
          const style = (element as HTMLElement).style;
          return Array.from(style).filter((name) => name !== "opacity")
            .map((name) => `${name}:${style.getPropertyValue(name)}`).join(";");
        });
        if (!expertiseContent) {
          expertiseContent = content;
          expertiseLayout = layout;
          await callout.evaluate((element) => element.setAttribute("data-expertise-continuity", "retained"));
        } else {
          expect(content).toBe(expertiseContent);
          expect(layout).toBe(expertiseLayout);
          await expect(callout).toHaveAttribute("data-expertise-continuity", "retained");
        }
      }
      if (frame < timing.scenes[8].from) await expect(stage.locator("[data-voices-extension]")).toBeHidden();
      if (frame >= timing.scenes[8].from + 18) await expect(heading).toHaveCSS("opacity", "1");
      for (const [index, cue] of ["concept", "designImplementation", "delivery"].entries()) {
        const label = stage.locator("[data-stage-label]").nth(index);
        const from = timing.subCue(cue as "concept" | "designImplementation" | "delivery");
        if (frame < from) await expect(label).toHaveCSS("opacity", "0");
        if (frame >= from + 12) await expect(label).toHaveCSS("opacity", "1");
      }
      if (frame >= timing.scenes[8].from + 18) {
        const gap = await stage.evaluate((container) => {
          const scale = container.getBoundingClientRect().width / 1920;
          const heading = container.querySelector("[data-voices-heading]")!.getBoundingClientRect();
          const icon = container.querySelector("[data-stage-voice]")!.getBoundingClientRect();
          return (icon.top - heading.bottom) / scale;
        });
        expect(gap).toBeGreaterThanOrEqual(30);
        expect(gap).toBeLessThanOrEqual(40);
      }
      const pathOffset = await stage.locator("[data-voices-path]").getAttribute("stroke-dashoffset");
      if (frame < timing.subCue("designImplementation")) expect(Number(pathOffset)).toBe(1);
      if (frame >= timing.subCue("designImplementation") + 18 && frame < timing.subCue("delivery")) {
        expect(Number(pathOffset)).toBe(0.5);
      }
      if (frame >= timing.subCue("delivery") + 18) expect(Number(pathOffset)).toBe(0);
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
      expect(Number(findings.anchor)).toBe(y);
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
