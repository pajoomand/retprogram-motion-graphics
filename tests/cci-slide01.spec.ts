import { expect, test } from "@playwright/test";
import { createHash } from "node:crypto";
import analysis from "../src/courses/cci-health-innovation/section-01-slide-01/audio-analysis.json";
import { slide01Config } from "../src/courses/cci-health-innovation/section-01-slide-01/video.config";

test.describe("CCI Slide 1 narration and layout", () => {
  test.skip(
    process.env.RETPROGRAM_QA_COMPOSITION_ID !== slide01Config.id,
    "This opt-in visual proof test belongs only to CCI Slide 1.",
  );

  test("master duration and phrase cues use measured audio", () => {
    expect(slide01Config.durationInFrames).toBe(
      Math.ceil(analysis.ffprobeDurationSeconds * slide01Config.fps),
    );
    const rounding =
      slide01Config.durationInFrames / slide01Config.fps -
      analysis.ffprobeDurationSeconds;
    expect(rounding).toBeGreaterThanOrEqual(0);
    expect(rounding).toBeLessThan(1 / slide01Config.fps);
    for (const cue of analysis.cues) {
      expect(
        Math.abs(cue.frame / slide01Config.fps - cue.seconds),
      ).toBeLessThanOrEqual(0.5 / slide01Config.fps);
    }
  });

  test("clean video has no caption overlay and perspectives stay readable", async ({
    page,
  }) => {
    test.setTimeout(120_000);
    const errors: string[] = [];
    const seekCancellations: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("requestfailed", (request) => {
      const failure = `${request.url()}: ${request.failure()?.errorText}`;
      if (
        request.failure()?.errorText === "net::ERR_ABORTED" &&
        request.url().endsWith(slide01Config.narrationSrc)
      ) {
        seekCancellations.push(failure);
      } else {
        errors.push(failure);
      }
    });
    page.on("response", (response) => {
      if (response.status() >= 400) {
        errors.push(`${response.status()} ${response.url()}`);
      }
    });
    const audioRequest = page.waitForRequest((request) =>
      request.url().endsWith(slide01Config.narrationSrc),
    );
    await page.goto(`/${slide01Config.id}`);
    const audioResponse = await page.request.get((await audioRequest).url());
    expect(
      audioResponse.ok(),
      "Narration asset loads independently of scrubbing",
    ).toBe(true);
    expect(
      createHash("sha256")
        .update(Uint8Array.from(await audioResponse.body()))
        .digest("hex"),
    ).toBe(analysis.sha256);
    const stage = page.locator(".remotion-studio-composition-container");
    await expect(stage).toBeVisible();
    const readout = (frame: number) =>
      page
        .getByRole("button", { name: String(frame), exact: true })
        .and(page.locator("button[aria-label]"));
    const frameReadout = readout(0);
    await expect(frameReadout).toBeVisible();
    let currentFrame = 0;
    const seek = async (frame: number) => {
      await readout(currentFrame).click();
      const input = page.getByRole("textbox");
      await input.fill(String(frame));
      await input.press("Enter");
      await expect(readout(frame)).toBeVisible();
      currentFrame = frame;
    };

    const boundaries = [...analysis.cues.map((cue) => cue.frame), 1123];
    const textEntrances = [
      ["course-header", 0],
      ["program-label", 5],
      ["opening-eyebrow", 8],
      ["opening-title", 13],
      ["opening-support", 18],
      ["decision-label", 18],
      ["clinical-title", 161],
      ["clinical-detail", 166],
      ["innovation-title", 286],
      ["innovation-detail", 291],
      ["funding-title", 463],
      ["funding-detail", 468],
      ["experience-title", 632],
      ["experience-detail", 637],
      ["resolution-perspectives", 1057],
      ["resolution-decisions", 1063],
    ] as const;
    const motionSamples = new Map<
      string,
      { frame: number; opacity: number; y: number }[]
    >();
    const frames = Array.from(
      new Set([
        0,
        90,
        220,
        350,
        540,
        710,
        880,
        980,
        1179,
        ...textEntrances.flatMap(([, from]) => [
          from,
          from + 1,
          from + 7,
          from + 14,
        ]),
        ...boundaries.flatMap((frame) => [frame - 1, frame, frame + 1]),
      ]),
    ).sort((a, b) => a - b);
    for (const frame of frames) {
      if (frame !== currentFrame) await seek(frame);
      await expect(stage.locator("[data-cci-captions]")).toHaveCount(0);
      const findings = await stage.evaluate((container) => {
        const bounds = container.getBoundingClientRect();
        const scale = bounds.width / 1920;
        const leaves = Array.from(
          container.querySelectorAll<HTMLElement>("*"),
        ).filter((element) => {
          if (element.children.length || !element.textContent?.trim())
            return false;
          let parent: HTMLElement | null = element;
          while (parent && parent !== container) {
            const style = getComputedStyle(parent);
            if (
              Number(style.opacity) < 0.05 ||
              style.visibility === "hidden" ||
              style.display === "none"
            )
              return false;
            parent = parent.parentElement;
          }
          return true;
        });
        const outside = leaves
          .filter((element) => {
            const box = element.getBoundingClientRect();
            return (
              box.left < bounds.left + 90 * scale ||
              box.right > bounds.right - 90 * scale ||
              box.top < bounds.top + 52 * scale ||
              box.bottom > bounds.bottom - 52 * scale ||
              element.scrollWidth > element.clientWidth + 2
            );
          })
          .map((element) => element.textContent?.trim());
        const cards = Array.from(
          container.querySelectorAll<HTMLElement>("[data-perspective]"),
        );
        const overlapping = cards.flatMap((card, index) => {
          if (Number(getComputedStyle(card).opacity) < 0.05) return [];
          const a = card.getBoundingClientRect();
          return cards
            .slice(index + 1)
            .filter((other) => {
              if (Number(getComputedStyle(other).opacity) < 0.05) return false;
              const b = other.getBoundingClientRect();
              return (
                a.left < b.right &&
                a.right > b.left &&
                a.top < b.bottom &&
                a.bottom > b.top
              );
            })
            .map(
              (other) =>
                `${card.dataset.perspective}/${other.dataset.perspective}`,
            );
        });
        return {
          outside,
          overlapping,
          fontsLoaded: document.fonts.check("600 29px Inter"),
        };
      });
      expect(
        findings.outside,
        `Frame ${frame}: text safe area and overflow`,
      ).toEqual([]);
      expect(
        findings.overlapping,
        `Frame ${frame}: perspective overlaps`,
      ).toEqual([]);
      expect(findings.fontsLoaded).toBe(true);

      const textStates = await stage
        .locator("[data-cci-text]")
        .evaluateAll((elements) =>
          elements.map((element) => {
            const text = element.querySelector<HTMLElement>(
              "[data-cci-text-content]",
            );
            if (!text) throw new Error("Missing animated text content.");
            const style = getComputedStyle(text);
            const y = Number.parseFloat(style.translate.split(" ")[1] ?? "0");
            let parent = text.parentElement;
            let ancestorOpacity = 1;
            while (
              parent &&
              !parent.classList.contains(
                "remotion-studio-composition-container",
              )
            ) {
              ancestorOpacity *= Number(getComputedStyle(parent).opacity);
              parent = parent.parentElement;
            }
            return {
              id: element.getAttribute("data-cci-text"),
              from: Number(element.getAttribute("data-text-from")),
              duration: Number(element.getAttribute("data-text-duration")),
              opacity: Number(style.opacity),
              y,
              ancestorOpacity,
            };
          }),
        );
      expect(textStates).toHaveLength(textEntrances.length);
      for (const [id, from] of textEntrances) {
        const state = textStates.find((item) => item.id === id);
        expect(state, id).toBeDefined();
        if (!state) throw new Error(`Missing ${id}`);
        expect(state.from, id).toBe(from);
        expect(state.duration, id).toBe(14);
        expect(state.y, `${id}: no upward overshoot`).toBeGreaterThanOrEqual(0);
        expect(state.y).toBeLessThanOrEqual(10);
        expect(state.y).toBeCloseTo(10 * (1 - state.opacity), 3);
        if (frame <= from) {
          expect(state.opacity, `${id} must not appear early`).toBe(0);
          expect(state.y).toBe(10);
        } else if (frame >= from + 14) {
          expect(state.opacity, `${id} must settle within 14 frames`).toBe(1);
          expect(state.y).toBe(0);
        } else {
          expect(state.opacity).toBeGreaterThan(0);
          expect(state.opacity).toBeLessThan(1);
        }
        if (frame >= from && frame <= from + 14) {
          expect(
            state.ancestorOpacity,
            `${id}: no compounded parent fade`,
          ).toBe(1);
          const samples = motionSamples.get(id) ?? [];
          samples.push({ frame, opacity: state.opacity, y: state.y });
          motionSamples.set(id, samples);
        }
        if (frame === from + 7)
          expect(state.opacity, `${id}: ease-out midpoint`).toBeGreaterThan(
            0.5,
          );
      }

      for (const [id, cue] of [
        ["clinical", 156],
        ["innovation", 281],
        ["funding", 458],
        ["experience", 627],
      ] as const) {
        const opacity = await stage
          .locator(`[data-perspective="${id}"] [data-perspective-surface]`)
          .evaluate((element) => Number(getComputedStyle(element).opacity));
        if (frame <= cue) expect(opacity).toBe(0);
        if (frame >= cue + 32) expect(opacity).toBe(1);
      }
      for (const [id, samples] of motionSamples) {
        for (let index = 1; index < samples.length; index++) {
          expect(
            samples[index].opacity,
            `${id}: monotonic fade`,
          ).toBeGreaterThanOrEqual(samples[index - 1].opacity);
          expect(
            samples[index].y,
            `${id}: monotonic upward settle`,
          ).toBeLessThanOrEqual(samples[index - 1].y);
        }
      }
      await test.info().attach("typography-entrance-measurements", {
        body: JSON.stringify(Object.fromEntries(motionSamples), null, 2),
        contentType: "application/json",
      });
    }
    await expect(stage).toContainText("BETTER-INFORMED DECISIONS");
    await expect(stage).toContainText("Lived experience");
    await test.info().attach("recorded-media-seek-cancellations", {
      body: JSON.stringify(
        {
          explanation:
            "Rapid Studio scrubbing can cancel in-flight narration range requests. The complete asset was fetched and its SHA-256 verified; other request failures remain errors.",
          requests: seekCancellations,
        },
        null,
        2,
      ),
      contentType: "application/json",
    });
    expect(errors).toEqual([]);
  });
});
