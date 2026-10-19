import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { checkpointAtOrAfter } from "../functions/checkpointAtOrAfter.function.ts";

describe("Using checkpointAtOrAfter, when a unit is freed between checkpoints", () => {
    test("then it should wait for the next checkpoint", () => {
        assert.equal(checkpointAtOrAfter(1_000, 100, 1_150), 1_200);
    });
});

describe("Using checkpointAtOrAfter, when a unit is freed exactly at a checkpoint", () => {
    test("then it should be offered at that checkpoint", () => {
        assert.equal(checkpointAtOrAfter(1_000, 100, 1_200), 1_200);
    });
});

describe("Using checkpointAtOrAfter, when the time is before the draw", () => {
    test("then it should return the draw time", () => {
        assert.equal(checkpointAtOrAfter(1_000, 100, 500), 1_000);
    });
});

describe("Using checkpointAtOrAfter, when the interval is not a positive whole number", () => {
    test("then it should throw", () => {
        assert.throws(() => checkpointAtOrAfter(0, 0, 10), RangeError);
    });
});
