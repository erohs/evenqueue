import assert from "node:assert/strict";
import { describe, test } from "node:test";
import fixture from "#tests/vectors/drandQuicknetRound1000000.json" with { type: "json" };
import { beaconRoundTime } from "../functions/beaconRoundTime.function.ts";
import { toBeaconRound } from "../functions/toBeaconRound.function.ts";

describe("Using beaconRoundTime, for a real quicknet round", () => {
    test("then it should give the round's publication time", () => {
        assert.equal(beaconRoundTime(toBeaconRound(fixture.round)), fixture.expectedRoundTimeMilliseconds);
    });
});

describe("Using toBeaconRound, for round zero", () => {
    test("then it should refuse it, because rounds start at one", () => {
        assert.throws(() => toBeaconRound(0), RangeError);
    });
});
