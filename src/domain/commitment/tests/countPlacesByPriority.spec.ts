import assert from "node:assert/strict";
import { describe, test } from "node:test";
import vectors from "#tests/vectors/waitlistCommitment.json" with { type: "json" };
import { countPlacesByPriority } from "../functions/countPlacesByPriority.function.ts";

describe("Using countPlacesByPriority, when places hold several priorities", () => {
    test("then it should count each, highest priority first", () => {
        assert.deepEqual(countPlacesByPriority(vectors.leaves), [
            { priority: 2, placeCount: 2 },
            { priority: 1, placeCount: 1 },
            { priority: 0, placeCount: 1 },
            { priority: -3, placeCount: 1 },
        ]);
    });
});
