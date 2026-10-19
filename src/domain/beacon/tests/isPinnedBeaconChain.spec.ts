import assert from "node:assert/strict";
import { describe, test } from "node:test";
import fixture from "#tests/vectors/drandQuicknetRound1000000.json" with { type: "json" };
import { isPinnedBeaconChain } from "../functions/isPinnedBeaconChain.function.ts";

const chainInfo = JSON.parse(fixture.chainInfoBody) as Record<string, unknown>;

describe("Using isPinnedBeaconChain, when an endpoint reports the real quicknet chain", () => {
    test("then it should accept it", () => {
        assert.equal(isPinnedBeaconChain(chainInfo), true);
    });
});

describe("Using isPinnedBeaconChain, when an endpoint reports a different public key", () => {
    test("then it should refuse it", () => {
        const otherKey = JSON.parse(fixture.chainInfoBody.replace(/"public_key":"[0-9a-f]+"/u, '"public_key":"00"'));
        assert.equal(isPinnedBeaconChain(otherKey), false);
    });
});

describe("Using isPinnedBeaconChain, when an endpoint reports a different period", () => {
    test("then it should refuse it, because round times would no longer match", () => {
        assert.equal(isPinnedBeaconChain({ ...chainInfo, period: 30 }), false);
    });
});
