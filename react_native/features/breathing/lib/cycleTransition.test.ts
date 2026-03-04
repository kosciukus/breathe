declare function require(name: string): any;

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  resolveCycleTransition,
} = require("./cycleTransition") as typeof import("./cycleTransition");

const durations = {
  inhale: 4,
  hold1: 2,
  exhale: 6,
  hold2: 2,
} as const;

const equalBreathingDurations = {
  inhale: 4,
  hold1: 0,
  exhale: 4,
  hold2: 0,
} as const;

test("continues the rest of the cycle after the session expires during inhale", () => {
  assert.deepEqual(
    resolveCycleTransition({
      currentPhase: "inhale",
      durations,
      spillMs: 0,
      stopAfterCycle: true,
    }),
    { action: "continue", phase: "hold1", remainingMs: 2000 },
  );

  assert.deepEqual(
    resolveCycleTransition({
      currentPhase: "hold1",
      durations,
      spillMs: 0,
      stopAfterCycle: true,
    }),
    { action: "continue", phase: "exhale", remainingMs: 6000 },
  );

  assert.deepEqual(
    resolveCycleTransition({
      currentPhase: "exhale",
      durations,
      spillMs: 0,
      stopAfterCycle: true,
    }),
    { action: "continue", phase: "hold2", remainingMs: 2000 },
  );

  assert.deepEqual(
    resolveCycleTransition({
      currentPhase: "hold2",
      durations,
      spillMs: 0,
      stopAfterCycle: true,
    }),
    { action: "stop" },
  );
});

test("stops at the cycle boundary even if the tick overshoots past it", () => {
  assert.deepEqual(
    resolveCycleTransition({
      currentPhase: "exhale",
      durations,
      spillMs: 6500,
      stopAfterCycle: true,
    }),
    { action: "stop" },
  );
});

test("transitions to exhale exactly when a 4 second inhale completes", () => {
  assert.deepEqual(
    resolveCycleTransition({
      currentPhase: "inhale",
      durations: equalBreathingDurations,
      spillMs: 0,
      stopAfterCycle: false,
    }),
    { action: "continue", phase: "exhale", remainingMs: 4000 },
  );
});

test("subtracts overshoot from exhale instead of extending the next phase", () => {
  assert.deepEqual(
    resolveCycleTransition({
      currentPhase: "inhale",
      durations: equalBreathingDurations,
      spillMs: 1500,
      stopAfterCycle: false,
    }),
    { action: "continue", phase: "exhale", remainingMs: 2500 },
  );
});
