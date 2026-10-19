import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { mergeServiceGaps } from "../functions/mergeServiceGaps.function.ts";

describe("Using mergeServiceGaps, when gaps arrive out of order and overlap", () => {
    test("then it should sort them and join the overlapping ones", () => {
        const gaps = [
            { startsAt: 50, endsAt: 60 },
            { startsAt: 10, endsAt: 20 },
            { startsAt: 15, endsAt: 30 },
        ];
        assert.deepEqual(mergeServiceGaps(gaps), [
            { startsAt: 10, endsAt: 30 },
            { startsAt: 50, endsAt: 60 },
        ]);
    });
});

describe("Using mergeServiceGaps, when one gap ends where the next starts", () => {
    test("then it should join them", () => {
        const gaps = [
            { startsAt: 10, endsAt: 20 },
            { startsAt: 20, endsAt: 25 },
        ];
        assert.deepEqual(mergeServiceGaps(gaps), [{ startsAt: 10, endsAt: 25 }]);
    });
});
