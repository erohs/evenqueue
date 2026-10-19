import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { toEpochMilliseconds } from "#domain/shared/time/functions/toEpochMilliseconds.function.ts";
import { createServiceGap } from "../functions/createServiceGap.function.ts";
import { mergeServiceGaps } from "../functions/mergeServiceGaps.function.ts";

const gap = (startsAt: number, endsAt: number) =>
    createServiceGap(toEpochMilliseconds(startsAt), toEpochMilliseconds(endsAt));

describe("Using mergeServiceGaps, when gaps arrive out of order and overlap", () => {
    test("then it should sort them and join the overlapping ones", () => {
        assert.deepEqual(mergeServiceGaps([gap(50, 60), gap(10, 20), gap(15, 30)]), [gap(10, 30), gap(50, 60)]);
    });
});

describe("Using mergeServiceGaps, when one gap ends where the next starts", () => {
    test("then it should join them", () => {
        assert.deepEqual(mergeServiceGaps([gap(10, 20), gap(20, 25)]), [gap(10, 25)]);
    });
});
