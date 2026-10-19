import assert from "node:assert/strict";
import { describe, test } from "node:test";
import fixture from "#tests/vectors/drandQuicknetRound1000000.json" with { type: "json" };
import { summariseBeaconReadings } from "../functions/summariseBeaconReadings.function.ts";
import type { IBeaconRound } from "../interfaces/IBeaconRound.ts";

const realRound = JSON.parse(fixture.roundBodies["api.drand.sh"]) as IBeaconRound;
const otherRound: IBeaconRound = { ...realRound, signature: "1".repeat(96) };

describe("Using summariseBeaconReadings, when two endpoints return the same round", () => {
    test("then it should agree on that round", () => {
        const summary = summariseBeaconReadings([
            { endpointName: "first", beaconRound: realRound },
            { endpointName: "second", beaconRound: realRound },
            { endpointName: "down", beaconRound: null },
        ]);
        assert.deepEqual(summary, {
            status: "agreed",
            beaconRound: realRound,
            answeringEndpointNames: ["first", "second"],
        });
    });
});

describe("Using summariseBeaconReadings, when only one endpoint answers", () => {
    test("then it should not use the round", () => {
        const summary = summariseBeaconReadings([
            { endpointName: "first", beaconRound: realRound },
            { endpointName: "down", beaconRound: null },
        ]);
        assert.equal(summary.status, "single-endpoint");
    });
});

describe("Using summariseBeaconReadings, when endpoints return different signatures", () => {
    test("then it should report the disagreement and use neither", () => {
        const summary = summariseBeaconReadings([
            { endpointName: "first", beaconRound: realRound },
            { endpointName: "second", beaconRound: realRound },
            { endpointName: "third", beaconRound: otherRound },
        ]);
        assert.deepEqual([summary.status, summary.beaconRound], ["endpoints-disagree", null]);
    });
});

describe("Using summariseBeaconReadings, when no endpoint answers", () => {
    test("then it should report the beacon unavailable", () => {
        assert.equal(summariseBeaconReadings([{ endpointName: "down", beaconRound: null }]).status, "unavailable");
    });
});
