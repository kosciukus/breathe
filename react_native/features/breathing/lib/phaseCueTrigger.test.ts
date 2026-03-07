declare function require(name: string): any;

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  triggerPhaseCue,
} = require("./phaseCueTrigger") as typeof import("./phaseCueTrigger");

test("does not trigger cue when not running", () => {
  let calls = 0;
  triggerPhaseCue({
    isRunning: false,
    isPreparing: false,
    phase: "inhale",
    playPhaseTone: async () => {
      calls += 1;
    },
  });
  assert.equal(calls, 0);
});

test("does not trigger cue during countdown", () => {
  let calls = 0;
  triggerPhaseCue({
    isRunning: true,
    isPreparing: true,
    phase: "inhale",
    playPhaseTone: async () => {
      calls += 1;
    },
  });
  assert.equal(calls, 0);
});

test("triggers cue without waiting for playback completion", () => {
  const neverResolves = new Promise<void>(() => undefined);
  let calls = 0;

  const result = triggerPhaseCue({
    isRunning: true,
    isPreparing: false,
    phase: "inhale",
    playPhaseTone: async () => {
      calls += 1;
      return neverResolves;
    },
  });

  assert.equal(calls, 1);
  assert.equal(result, undefined);
});
