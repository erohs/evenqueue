import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { placesNeededForDraw } from "../functions/placesNeededForDraw.function.ts";

describe("Using placesNeededForDraw, with one backfill offer per unit", () => {
    test("then it should keep two places per unit", () => {
        assert.equal(placesNeededForDraw(10, 1), 20);
    });
});

describe("Using placesNeededForDraw, when given a negative count", () => {
    test("then it should throw", () => {
        assert.throws(() => placesNeededForDraw(-1, 1), RangeError);
    });
});
