import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { deterministicBytes32Hex } from "#tests/support/functions/deterministicBytes32Hex.function.ts";
import { parseWaitlistPlace } from "../functions/parseWaitlistPlace.function.ts";

const stored = {
    placeId: deterministicBytes32Hex("stored"),
    drawsEntered: 3,
    offersReceived: 1,
    entryWindowNumber: 2,
    offersNotTakenSinceLastMove: 1,
};

describe("Using parseWaitlistPlace, when a stored place is well formed", () => {
    test("then it should return it with only the known fields", () => {
        const result = parseWaitlistPlace({ ...stored, smuggled: "extra" });
        assert.deepEqual(result, { isValid: true, value: stored });
    });
});

describe("Using parseWaitlistPlace, when a counter is not a whole number", () => {
    test("then it should name the field", () => {
        assert.deepEqual(parseWaitlistPlace({ ...stored, drawsEntered: Number.NaN }), {
            isValid: false,
            problems: ["drawsEntered is missing or invalid"],
        });
    });
});

describe("Using parseWaitlistPlace, when more offers were received than draws entered", () => {
    test("then it should refuse the place", () => {
        assert.equal(parseWaitlistPlace({ ...stored, offersReceived: 4 }).isValid, false);
    });
});
