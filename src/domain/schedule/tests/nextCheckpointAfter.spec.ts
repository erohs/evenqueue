import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { nextCheckpointAfter } from "../functions/nextCheckpointAfter.function.ts";

describe("Using nextCheckpointAfter, when it is exactly a checkpoint", () => {
    test("then it should name the following checkpoint", () => {
        assert.equal(nextCheckpointAfter(1_000, 100, 1_200), 1_300);
    });
});

describe("Using nextCheckpointAfter, when it is between checkpoints", () => {
    test("then it should name the next one", () => {
        assert.equal(nextCheckpointAfter(1_000, 100, 1_250), 1_300);
    });
});

describe("Using nextCheckpointAfter, when the draw has not happened yet", () => {
    test("then it should name the draw time", () => {
        assert.equal(nextCheckpointAfter(1_000, 100, 999), 1_000);
    });
});
