import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { serviceGapBetweenHeartbeats } from "../functions/serviceGapBetweenHeartbeats.function.ts";

const minute = 60_000;

describe("Using serviceGapBetweenHeartbeats, when up to three heartbeats are missed", () => {
    test("then it should not count a gap", () => {
        assert.equal(serviceGapBetweenHeartbeats(0, 3 * minute), null);
    });
});

describe("Using serviceGapBetweenHeartbeats, when more than three heartbeats are missed", () => {
    test("then it should start the gap one interval after the last beat and end it at the next", () => {
        assert.deepEqual(serviceGapBetweenHeartbeats(0, 10 * minute), { startsAt: minute, endsAt: 10 * minute });
    });
});
