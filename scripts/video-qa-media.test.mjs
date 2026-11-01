import { test } from "node:test";
import assert from "node:assert/strict";
import { analyzeRgbFrames } from "./video-qa-media.mjs";

function analyze(values, overrides = {}) {
  return analyzeRgbFrames(
    Buffer.concat(values.map((value) => Buffer.alloc(12, value))),
    {
      width: 2,
      height: 2,
      fps: 10,
      expectedFrames: values.length,
      pixelThreshold: 0.1,
      freezeNoise: "-60dB",
      ...overrides,
    },
  );
}

test("black intervals include opening, internal and trailing runs", () => {
  assert.deepEqual(analyze([0, 0, 255, 0, 255, 0]).black, [
    { start: 0, end: 0.2, duration: 0.2 },
    { start: 0.3, end: 0.4, duration: 0.1 },
    { start: 0.5, end: 0.6, duration: 0.1 },
  ]);
});

test("black threshold uses the configured pixel value", () => {
  assert.equal(analyze([25, 26, 255]).black.length, 1);
  assert.deepEqual(analyze([25, 26, 255]).black[0], {
    start: 0,
    end: 0.1,
    duration: 0.1,
  });
  assert.deepEqual(analyze([255, 255]).black, []);
});

test("static intervals include their full run and stop on movement", () => {
  assert.deepEqual(analyze([50, 50, 50, 100, 100]).freeze, [
    { start: 0, end: 0.3, duration: 0.3 },
    { start: 0.3, end: 0.5, duration: 0.2 },
  ]);
  assert.deepEqual(analyze([50, 60, 70, 80]).freeze, []);
});

test("slow accumulating movement is compared with the run anchor", () => {
  const result = analyze([50, 51, 52, 53, 54, 55], { freezeNoise: "-40dB" });
  assert.deepEqual(result.freeze, [
    { start: 0, end: 0.3, duration: 0.3 },
    { start: 0.3, end: 0.6, duration: 0.3 },
  ]);
});

test("partial decodes and invalid thresholds fail explicitly", () => {
  assert.throws(() => analyze([0], { expectedFrames: 2 }), /frame count/);
  assert.throws(() => analyze([0], { freezeNoise: "invalid" }), /Invalid/);
  assert.throws(() => analyze([0], { pixelThreshold: 2 }), /Invalid/);
});
