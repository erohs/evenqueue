import assert from "node:assert/strict";
import { describe, test } from "node:test";
import fixture from "#tests/vectors/drandQuicknetRound1000000.json" with { type: "json" };
import { toEpochMilliseconds } from "#domain/shared/time/functions/toEpochMilliseconds.function.ts";
import { firstBeaconRoundAtOrAfter } from "../functions/firstBeaconRoundAtOrAfter.function.ts";

const roundTime = fixture.expectedRoundTimeMilliseconds;

describe("Using firstBeaconRoundAtOrAfter, at a round's exact time", () => {
    test("then it should name that round", () => {
        assert.equal(firstBeaconRoundAtOrAfter(toEpochMilliseconds(roundTime)), fixture.round);
    });
});

describe("Using firstBeaconRoundAtOrAfter, just after a round's time", () => {
    test("then it should name the next round", () => {
        assert.equal(firstBeaconRoundAtOrAfter(toEpochMilliseconds(roundTime + 1)), fixture.round + 1);
    });
});

describe("Using firstBeaconRoundAtOrAfter, before the chain began", () => {
    test("then it should name the first round", () => {
        assert.equal(firstBeaconRoundAtOrAfter(toEpochMilliseconds(0)), 1);
    });
});
