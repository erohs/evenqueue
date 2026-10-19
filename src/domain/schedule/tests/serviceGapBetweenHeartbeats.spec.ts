import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { toEpochMilliseconds } from "#domain/shared/time/functions/toEpochMilliseconds.function.ts";
import { serviceGapBetweenHeartbeats } from "../functions/serviceGapBetweenHeartbeats.function.ts";

const minute = 60_000;
const at = toEpochMilliseconds;

describe("Using serviceGapBetweenHeartbeats, when up to three heartbeats are missed", () => {
    test("then it should not count a gap", () => {
        assert.equal(serviceGapBetweenHeartbeats(at(0), at(3 * minute)), null);
    });
});

describe("Using serviceGapBetweenHeartbeats, when more than three heartbeats are missed", () => {
    test("then it should start the gap one interval after the last beat and end it at the next", () => {
        assert.deepEqual(serviceGapBetweenHeartbeats(at(0), at(10 * minute)), {
            startsAt: minute,
            endsAt: 10 * minute,
        });
    });
});
