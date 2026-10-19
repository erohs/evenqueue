import assert from "node:assert/strict";
import { describe, test } from "node:test";
import fixture from "#tests/vectors/drandQuicknetRound1000000.json" with { type: "json" };
import { firstBeaconRoundAtOrAfter } from "../functions/firstBeaconRoundAtOrAfter.function.ts";

describe("Using firstBeaconRoundAtOrAfter, at a round's exact time", () => {
    test("then it should name that round", () => {
        assert.equal(firstBeaconRoundAtOrAfter(fixture.expectedRoundTimeMilliseconds), fixture.round);
    });
});

describe("Using firstBeaconRoundAtOrAfter, just after a round's time", () => {
    test("then it should name the next round", () => {
        assert.equal(firstBeaconRoundAtOrAfter(fixture.expectedRoundTimeMilliseconds + 1), fixture.round + 1);
    });
});

describe("Using firstBeaconRoundAtOrAfter, before the chain began", () => {
    test("then it should name the first round", () => {
        assert.equal(firstBeaconRoundAtOrAfter(0), 1);
    });
});
