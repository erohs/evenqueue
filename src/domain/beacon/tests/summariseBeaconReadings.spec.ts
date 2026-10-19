import assert from "node:assert/strict";
import { describe, test } from "node:test";
import fixture from "#tests/vectors/drandQuicknetRound1000000.json" with { type: "json" };
import { summariseBeaconReadings } from "../functions/summariseBeaconReadings.function.ts";
import { parseBeaconRound } from "../functions/parseBeaconRound.function.ts";
import { toBeaconRound } from "../functions/toBeaconRound.function.ts";
import type { IBeaconRound } from "../interfaces/IBeaconRound.ts";

const realRound =
    (await parseBeaconRound(JSON.parse(fixture.roundBodies["api.drand.sh"]), toBeaconRound(fixture.round))) ??
    assert.fail();
const otherRound: IBeaconRound = { ...realRound, signature: "1".repeat(96) };
const readings = (entries: [string, IBeaconRound | null][]) => new Map(entries);

describe("Using summariseBeaconReadings, when two endpoints return the same round", () => {
    test("then it should agree on that round", () => {
        const summary = summariseBeaconReadings(
            readings([
                ["https://first", realRound],
                ["https://second", realRound],
                ["https://down", null],
            ]),
        );
        assert.deepEqual(summary, {
            status: "agreed",
            beaconRound: realRound,
            answeringEndpoints: ["https://first", "https://second"],
        });
    });
});

describe("Using summariseBeaconReadings, when only one endpoint answers", () => {
    test("then it should not use the round", () => {
        assert.equal(
            summariseBeaconReadings(
                readings([
                    ["https://first", realRound],
                    ["https://down", null],
                ]),
            ).status,
            "single-endpoint",
        );
    });
});

describe("Using summariseBeaconReadings, when endpoints return different signatures", () => {
    test("then it should report the disagreement and use neither", () => {
        const summary = summariseBeaconReadings(
            readings([
                ["https://first", realRound],
                ["https://second", realRound],
                ["https://third", otherRound],
            ]),
        );
        assert.deepEqual([summary.status, summary.beaconRound], ["endpoints-disagree", null]);
    });
});

describe("Using summariseBeaconReadings, when no endpoint answers", () => {
    test("then it should report the beacon unavailable", () => {
        assert.equal(summariseBeaconReadings(readings([["https://down", null]])).status, "unavailable");
    });
});
