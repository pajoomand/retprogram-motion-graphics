import { expect, test } from "@playwright/test";
import path from "node:path";

const compositionId = process.env.RETPROGRAM_QA_COMPOSITION_ID;
const screenshotPath = process.env.RETPROGRAM_QA_SCREENSHOT;

test("composition loads in Remotion Studio without browser or layout errors", async ({
  page,
}) => {
  expect(compositionId, "Set RETPROGRAM_QA_COMPOSITION_ID").toBeTruthy();
  expect(screenshotPath, "Set RETPROGRAM_QA_SCREENSHOT").toBeTruthy();

  const browserErrors: string[] = [];
  page.on("pageerror", (error) => browserErrors.push(error.message));
  page.on("requestfailed", (request) => {
    browserErrors.push(
      `${request.method()} ${request.url()}: ${request.failure()?.errorText}`,
    );
  });
  page.on("response", (response) => {
    if (response.status() >= 400) {
      browserErrors.push(`${response.status()} ${response.url()}`);
    }
  });

  await page.goto(`/${encodeURIComponent(compositionId!)}`);
  await expect(page).toHaveURL(new RegExp(`/${compositionId}$`));
  await expect(page.locator("body")).toContainText(compositionId!);

  const stage = page.locator(".remotion-studio-composition-container");
  await expect(stage).toBeVisible();
  const stageBox = await stage.boundingBox();
  expect(stageBox).not.toBeNull();

  const visibleTextBoxes = await stage.evaluate((container) => {
    const root = container.getBoundingClientRect();
    return Array.from(container.querySelectorAll<HTMLElement>("*"))
      .filter((element) => {
        if (element.childElementCount > 0 || !element.textContent?.trim()) {
          return false;
        }

        const style = getComputedStyle(element);
        return style.display !== "none" && style.visibility !== "hidden";
      })
      .map((element) => {
        const box = element.getBoundingClientRect();
        return {
          text: element.textContent?.trim().slice(0, 80) ?? "",
          left: box.left - root.left,
          top: box.top - root.top,
          right: box.right - root.left,
          bottom: box.bottom - root.top,
        };
      });
  });

  for (const textBox of visibleTextBoxes) {
    expect(
      textBox.left,
      `Text outside left safe edge: ${textBox.text}`,
    ).toBeGreaterThanOrEqual(-2);
    expect(
      textBox.top,
      `Text outside top safe edge: ${textBox.text}`,
    ).toBeGreaterThanOrEqual(-2);
    expect(
      textBox.right,
      `Text outside right safe edge: ${textBox.text}`,
    ).toBeLessThanOrEqual(stageBox!.width + 2);
    expect(
      textBox.bottom,
      `Text outside bottom safe edge: ${textBox.text}`,
    ).toBeLessThanOrEqual(stageBox!.height + 2);
  }

  await page.screenshot({ path: path.resolve(screenshotPath!) });
  expect(browserErrors).toEqual([]);
});
