import assert from "node:assert/strict";
import { describe, test } from "node:test";
import fixture from "#tests/vectors/drandQuicknetRound1000000.json" with { type: "json" };
import { parseBeaconRound } from "../functions/parseBeaconRound.function.ts";
import { toBeaconRound } from "../functions/toBeaconRound.function.ts";

const round = toBeaconRound(fixture.round);
const cloudflareBody: unknown = JSON.parse(fixture.roundBodies["drand.cloudflare.com"]);
const drandBody = JSON.parse(fixture.roundBodies["api.drand.sh"]) as Record<string, unknown>;

describe("Using parseBeaconRound, when given real round bodies whose fields come in different orders", () => {
    test("then it should read the same round from both endpoints", async () => {
        assert.deepEqual(await parseBeaconRound(drandBody, round), await parseBeaconRound(cloudflareBody, round));
    });

    test("then it should return the published randomness", async () => {
        assert.equal((await parseBeaconRound(drandBody, round))?.randomness, fixture.expectedRandomness);
    });
});

describe("Using parseBeaconRound, when the body names a different round", () => {
    test("then it should refuse it, so the latest round can never stand in for the committed one", async () => {
        assert.equal(await parseBeaconRound(drandBody, toBeaconRound(fixture.round + 1)), null);
    });
});

describe("Using parseBeaconRound, when the randomness is not the hash of the signature", () => {
    test("then it should refuse it", async () => {
        assert.equal(await parseBeaconRound({ ...drandBody, randomness: "0".repeat(64) }, round), null);
    });
});

describe("Using parseBeaconRound, when the body is not an object", () => {
    test("then it should refuse it", async () => {
        assert.equal(await parseBeaconRound("not a round", round), null);
    });
});
