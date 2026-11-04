import { expect, test } from "@playwright/test";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import manifest from "../src/courses/cci-health-innovation/section-01-slide-02/storyboard.config.json";
import { slide02Poses } from "../src/courses/cci-health-innovation/section-01-slide-02/Storyboard";
import { slide02Config } from "../src/courses/cci-health-innovation/section-01-slide-02/video.config";

test("Slide 2 storyboard is static, legible and preserves its human approval state", async ({ page }) => {
  test.skip(
    process.env.RETPROGRAM_QA_COMPOSITION_ID !== manifest.storyboardCompositionId,
    "Storyboard-only layout review; do not run during another video's production QA.",
  );
  test.setTimeout(180_000);
  const statusPath = path.resolve(
    "src", "courses", "cci-health-innovation", "section-01-slide-02", "production-status.json",
  );
  const initialStatus = await readFile(statusPath, "utf8");
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("requestfailed", (request) => errors.push(`${request.url()}: ${request.failure()?.errorText}`));
  page.on("response", (response) => {
    if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
  });
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(`/${manifest.storyboardCompositionId}`);
  const stage = page.locator(".remotion-studio-composition-container");
  await expect(stage).toBeVisible();
  const readout = (frame: number) => page
    .getByRole("button", { name: String(frame), exact: true })
    .and(page.locator("button[aria-label]"));
  let current = 0;
  await expect(readout(current)).toBeVisible();
  const seek = async (frame: number) => {
    if (frame !== current) {
      await readout(current).click();
      const input = page.getByRole("textbox");
      await input.fill(String(frame));
      await input.press("Enter");
      await expect(readout(frame)).toBeVisible();
      current = frame;
    }
  };
  const checks = [];
  let expertiseContents = "";
  let expertiseStyles = "";
  expect(manifest.beats).toHaveLength(9);
  expect(slide02Poses.at(-1)).toBe("voices");
  await stage.locator("[data-persistent]").evaluateAll((elements) => {
    elements.forEach((element, index) => element.setAttribute("data-continuity-token", String(index)));
  });
  const identities = await stage.locator("[data-persistent]").evaluateAll((elements) =>
    elements.map((element) => ({
      name: element.getAttribute("data-persistent"),
      token: element.getAttribute("data-continuity-token"),
    })));
  const anchorGeometry = () => stage.locator(
    "[data-persistent='experience'], [data-persistent='connector'], [data-persistent='workspace']",
  ).evaluateAll((elements) => elements.map((element) =>
    ["cx", "cy", "r", "x", "y", "width", "height", "d"].map((attribute) => element.getAttribute(attribute))));
  let relationshipGeometry: Awaited<ReturnType<typeof anchorGeometry>> | undefined;
  for (const [index, pose] of slide02Poses.entries()) {
    const start = index * manifest.framesPerBeat;
    await seek(start);
    const activePose = stage.locator(`[data-slide02-pose="${pose}"]`);
    await expect(activePose).toHaveCount(1);
    await expect(stage.locator("audio, video")).toHaveCount(0);
    await expect(activePose).not.toContainText("CCI in Health Innovation");
    await expect(activePose).not.toContainText("Section 1 / Who is a consumer?");
    await expect(activePose).not.toContainText("RETPROGRAM");
    await expect(activePose).not.toContainText("RELEVANT EXPERIENCE. PURPOSEFUL INVOLVEMENT.");
    await expect(activePose.locator("[data-cci-eyebrow]")).toHaveCount(0);
    await expect(activePose.locator("[data-cci-text='slide02-title']")).toHaveText("Who is a consumer in this context?");
    await expect(activePose.locator("[data-persistent='innovation-identity']")).toHaveText("Innovation in development");
    await expect(activePose.locator("[data-persistent='workspace']")).toBeVisible({ visible: index > 0 });
    await expect(activePose.locator("[data-persistent='innovation-identity']")).toBeVisible({ visible: index > 0 });
    await expect(activePose.locator("[data-opening-expertise]")).toHaveCount(index === 0 ? 1 : 0);
    await expect(activePose.locator("[data-patient-carer-support]")).toHaveText("Including patients and carers");
    await expect(activePose.locator("[data-patient-carer-support]")).toHaveCSS("opacity", index < 2 ? "1" : "0");
    await expect(activePose.locator("[data-persistent='experience-labels']").getByText("Relevant lived experience", { exact: true })).toBeVisible();
    if (index === 0) {
      await expect(activePose.getByText("Expertise of a health condition or issue", { exact: true })).toBeVisible();
      await expect(activePose.getByText("Relevant lived experience + a role in informing and shaping the work", { exact: true })).toBeHidden();
    }
    const consumerCenter = await activePose.locator("[data-persistent='experience']").evaluate((element) => {
      const bounds = element.closest("[data-slide02-pose]")!.getBoundingClientRect();
      const scale = bounds.width / 1920;
      const circle = element.getBoundingClientRect();
      return {
        x: (circle.left + circle.width / 2 - bounds.left) / scale,
        y: (circle.top + circle.height / 2 - bounds.top) / scale,
      };
    });
    expect(consumerCenter.x).toBeCloseTo(index === 0 ? 960 : 360, 0);
    expect(consumerCenter.y).toBeCloseTo(index === 0 ? 540 : 495, 0);
    const connection = activePose.locator("[data-persistent='connector']");
    await expect(connection).toHaveAttribute("data-connection", index === 0 ? "absent" : index === 1 ? "dashed" : "solid");
    if (index === 0) await expect(connection).toHaveAttribute("visibility", "hidden");
    if (index === 1) {
      await expect(connection).toHaveAttribute("stroke-dasharray", "10 10");
      await expect(activePose.getByText("Experience alone ≠ involvement", { exact: true })).toBeVisible();
    }
    if (index >= 2) await expect(activePose.getByText("Invited to contribute", { exact: true })).toBeVisible();
    await expect(activePose.locator("[data-contribution][data-revealed='true']")).toHaveCount(Math.max(0, Math.min(4, index - 2)));
    if (index >= 6) {
      for (const label of ["Understand a need", "Question an assumption", "Consider options", "Inform a decision"]) {
        await expect(activePose.getByText(label, { exact: true })).toBeVisible();
      }
    }
    await expect(activePose.locator("[data-expertise]")).toBeVisible({ visible: index >= 7 });
    if (index === 1) relationshipGeometry = await anchorGeometry();
    if (index > 1) expect(await anchorGeometry()).toEqual(relationshipGeometry);
    await expect(activePose.locator("[data-workspace-content]")).toHaveCSS("opacity",
      index === 0 ? "0" : index === 7 ? "0.78" : "1");
    if (index >= 7) {
      const callout = activePose.locator("[data-expertise]");
      await expect(callout).toHaveCSS("left", "580px");
      await expect(callout).toHaveCSS("top", "620px");
      await expect(callout).toHaveCSS("width", "420px");
      expect(await callout.evaluate((element) => element.getBoundingClientRect().height /
        (element.closest("[data-slide02-pose]")!.getBoundingClientRect().width / 1920))).toBeLessThan(185);
      for (const label of ["Lived-experience expertise", "Relevant, realistic perspective"]) {
        await expect(callout.getByText(label, { exact: true })).toBeVisible();
      }
      await expect(callout.locator("[data-technical-message]")).toBeVisible();
      const contents = await callout.innerHTML();
      const styles = await callout.evaluate((element) => {
        const style = (element as HTMLElement).style;
        return Array.from(style).filter((name) => name !== "opacity")
          .map((name) => `${name}:${style.getPropertyValue(name)}`).join(";");
      });
      if (index === 7) {
        expertiseContents = contents;
        expertiseStyles = styles;
        await callout.evaluate((element) => element.setAttribute("data-callout-continuity", "retained"));
      } else {
        expect(contents).toBe(expertiseContents);
        expect(styles).toBe(expertiseStyles);
        await expect(callout).toHaveAttribute("data-callout-continuity", "retained");
      }
      await expect(callout).toHaveCSS("height", "176px");
      await expect(activePose).not.toContainText("Not expected to become a science");
    }
    await expect(activePose.locator("[data-voices-extension]")).toBeVisible({ visible: index === 8 });
    if (index >= 7) await expect(activePose.locator("[data-expertise]")).toHaveCSS("opacity", index === 8 ? "0.8" : "1");
    await expect(activePose.locator("[data-contribution-list]")).toHaveCSS("opacity", index === 8 ? "0.6" : "1");
    if (index === 8) {
      await expect(activePose.locator("[data-voices-heading]")).toHaveText("Whose lived-experience voices are needed?");
      await expect(activePose.locator("[data-voices-heading]")).toHaveCSS("font-size", "38px");
      await expect(activePose.locator("[data-stage-voice]")).toHaveCount(3);
      for (const label of await activePose.locator("[data-stage-label]").all()) {
        await expect(label).toHaveCSS("font-size", "32px");
      }
      const lowerTier = await activePose.evaluate((container) => {
        const bounds = container.getBoundingClientRect();
        const scale = bounds.width / 1920;
        const heading = container.querySelector("[data-voices-heading]")!.getBoundingClientRect();
        const upperBottom = Math.max(...[
          "[data-expertise]", "[data-persistent='workspace']",
        ].map((selector) => container.querySelector(selector)!.getBoundingClientRect().bottom));
        const pathway = container.querySelector("[data-voices-path]")!.getBoundingClientRect();
        const bubble = container.querySelector("[data-stage-voice]")!.getBoundingClientRect();
        const nodes = Array.from(container.querySelectorAll("[data-voices-extension] circle"))
          .map((node) => Number(node.getAttribute("cx")));
        const pathStyle = getComputedStyle(container.querySelector("[data-voices-path]")!);
        return {
          gap: (heading.top - upperBottom) / scale,
          headingCenter: (heading.left + heading.width / 2 - bounds.left) / scale,
          pathwayWidth: pathway.width / scale,
          headingToPathwayGap: (pathway.top - heading.bottom) / scale,
          headingToBubbleGap: (bubble.top - heading.bottom) / scale,
          bubbleTop: (bubble.top - bounds.top) / scale,
          headingTop: (heading.top - bounds.top) / scale,
          nodeSpacing: nodes.slice(1).map((x, index) => x - nodes[index]),
          pathwayStroke: pathStyle.stroke,
          pathwayStrokeWidth: pathStyle.strokeWidth,
        };
      });
      expect(lowerTier.gap).toBeCloseTo(79, 0);
      expect(lowerTier.headingTop).toBeCloseTo(825, 0);
      expect(lowerTier.bubbleTop).toBeCloseTo(916, 0);
      expect(lowerTier.headingToBubbleGap).toBeGreaterThanOrEqual(30);
      expect(lowerTier.headingToBubbleGap).toBeLessThanOrEqual(40);
      expect(lowerTier.nodeSpacing).toEqual([720, 720]);
      expect(lowerTier.pathwayStroke).toBe("rgb(45, 112, 106)");
      expect(lowerTier.pathwayStrokeWidth).toBe("2px");
      expect(lowerTier.headingCenter).toBeCloseTo(960, 0);
      expect(lowerTier.pathwayWidth).toBeCloseTo(1440, 0);
      expect(lowerTier.headingToPathwayGap).toBeGreaterThan(40);
    }
    expect(await stage.locator("[data-persistent]").evaluateAll((elements) =>
      elements.map((element) => ({
        name: element.getAttribute("data-persistent"), token: element.getAttribute("data-continuity-token"),
      })))).toEqual(identities);
    const findings = await activePose.evaluate((container) => {
      const bounds = container.getBoundingClientRect();
      const scale = bounds.width / 1920;
      const textRects: { text: string; left: number; right: number; top: number; bottom: number; footer: boolean }[] = [];
      const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
      let node = walker.nextNode();
      while (node) {
        const element = node.parentElement;
        const text = node.textContent?.trim();
        if (element && text && !element.closest("svg")) {
          let visible = true;
          let parent: Element | null = element;
          while (parent && parent !== container && visible) {
            const style = getComputedStyle(parent);
            visible = style.visibility !== "hidden" && style.display !== "none" && Number(style.opacity) >= 0.05;
            parent = parent.parentElement;
          }
          if (visible) {
            const range = document.createRange();
            range.selectNodeContents(node);
            for (const rect of Array.from(range.getClientRects())) {
              if (rect.width && rect.height) textRects.push({
                text, footer: Boolean(element.closest("[data-storyboard-footer]")),
                left: (rect.left - bounds.left) / scale,
                right: (rect.right - bounds.left) / scale,
                top: (rect.top - bounds.top) / scale,
                bottom: (rect.bottom - bounds.top) / scale,
              });
            }
          }
        }
        node = walker.nextNode();
      }
      const outside = textRects.filter((rect) =>
        rect.left < 90 || rect.right > 1830 || rect.top < 50 ||
        rect.bottom > (rect.footer ? 1068 : 1028));
      const overlaps = textRects.flatMap((rect, index) => textRects.slice(index + 1)
        .filter((other) => rect.left < other.right - 1 && rect.right > other.left + 1 &&
          rect.top < other.bottom - 1 && rect.bottom > other.top + 1)
        .map((other) => [rect.text, other.text]));
      const title = container.querySelector("[data-cci-text='slide02-title']")!;
      const diagram = container.querySelector("[data-cci-diagram]")!;
      const workspace = container.querySelector("[data-persistent='workspace']")!;
      return {
        outside, overlaps, fontsLoaded: document.fonts.check("600 29px Inter"),
        titleTop: (title.getBoundingClientRect().top - bounds.top) / scale,
        workspaceHeight: workspace.getBoundingClientRect().height / scale,
        diagramBounds: (() => {
          const box = diagram.getBoundingClientRect();
          return { left: (box.left - bounds.left) / scale, top: (box.top - bounds.top) / scale };
        })(),
      };
    });
    expect(findings.outside, `${pose}: text safe margins`).toEqual([]);
    expect(findings.overlaps, `${pose}: overlapping text`).toEqual([]);
    expect(findings.fontsLoaded).toBe(true);
    expect(findings.titleTop).toBeCloseTo(72, 0);
    expect(findings.workspaceHeight).toBeCloseTo(440, 0);
    expect(findings.diagramBounds.left).toBeCloseTo(0, 0);
    expect(findings.diagramBounds.top).toBeCloseTo(-50, 0);
    const text = await activePose.innerText();
    await seek(start + manifest.framesPerBeat - 1);
    await expect(activePose).toHaveCount(1);
    expect(await activePose.innerText()).toBe(text);
    checks.push({ pose, startInspectionFrame: start, findings });
  }
  expect(errors).toEqual([]);
  const finalStatus = await readFile(statusPath, "utf8");
  expect(finalStatus).toBe(initialStatus);
  const status = JSON.parse(finalStatus);
  expect(["awaiting-storyboard-approval", "storyboard-approved", "in-production",
    "awaiting-video-approval", "approved"]).toContain(status.state);
  const output = path.resolve("out", "storyboards", slide02Config.id);
  await mkdir(output, { recursive: true });
  await stage.screenshot({ path: path.join(output, "studio.png") });
  await writeFile(path.join(output, "layout-checks.json"), JSON.stringify({
    compositionId: manifest.storyboardCompositionId,
    approvalState: status.state,
    humanApprovalModified: false,
    scope: "Static storyboard layout only; not full video QA, content approval or audio synchronization.",
    browserErrors: errors,
    checks,
  }, null, 2));
});
