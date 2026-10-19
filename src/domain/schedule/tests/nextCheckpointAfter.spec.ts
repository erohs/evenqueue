import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { toDurationMilliseconds } from "#domain/shared/time/functions/toDurationMilliseconds.function.ts";
import { toEpochMilliseconds } from "#domain/shared/time/functions/toEpochMilliseconds.function.ts";
import { nextCheckpointAfter } from "../functions/nextCheckpointAfter.function.ts";

const at = toEpochMilliseconds;
const interval = toDurationMilliseconds(100);

describe("Using nextCheckpointAfter, when it is exactly a checkpoint", () => {
    test("then it should name the following checkpoint", () => {
        assert.equal(nextCheckpointAfter(at(1_000), interval, at(1_200)), 1_300);
    });
});

describe("Using nextCheckpointAfter, when it is between checkpoints", () => {
    test("then it should name the next one", () => {
        assert.equal(nextCheckpointAfter(at(1_000), interval, at(1_250)), 1_300);
    });
});

describe("Using nextCheckpointAfter, when the draw has not happened yet", () => {
    test("then it should name the draw time", () => {
        assert.equal(nextCheckpointAfter(at(1_000), interval, at(999)), 1_000);
    });
});
