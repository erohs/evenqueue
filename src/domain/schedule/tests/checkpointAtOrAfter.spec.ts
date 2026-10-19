import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { toDurationMilliseconds } from "#domain/shared/time/functions/toDurationMilliseconds.function.ts";
import { toEpochMilliseconds } from "#domain/shared/time/functions/toEpochMilliseconds.function.ts";
import { checkpointAtOrAfter } from "../functions/checkpointAtOrAfter.function.ts";

const at = toEpochMilliseconds;
const interval = toDurationMilliseconds(100);

describe("Using checkpointAtOrAfter, when a unit is freed between checkpoints", () => {
    test("then it should wait for the next checkpoint", () => {
        assert.equal(checkpointAtOrAfter(at(1_000), interval, at(1_150)), 1_200);
    });
});

describe("Using checkpointAtOrAfter, when a unit is freed exactly at a checkpoint", () => {
    test("then it should be offered at that checkpoint", () => {
        assert.equal(checkpointAtOrAfter(at(1_000), interval, at(1_200)), 1_200);
    });
});

describe("Using checkpointAtOrAfter, when the time is before the draw", () => {
    test("then it should return the draw time", () => {
        assert.equal(checkpointAtOrAfter(at(1_000), interval, at(500)), 1_000);
    });
});
