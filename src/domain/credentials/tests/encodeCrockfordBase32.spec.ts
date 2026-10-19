import assert from "node:assert/strict";
import { describe, test } from "node:test";
import vectors from "#tests/vectors/buyerCodes.json" with { type: "json" };
import { decodeHex } from "#domain/shared/bytes/functions/decodeHex.function.ts";
import { encodeCrockfordBase32 } from "../functions/encodeCrockfordBase32.function.ts";

describe("Using encodeCrockfordBase32, when given the shared cross-implementation vectors", () => {
    for (const [caseNumber, vector] of vectors.cases.entries()) {
        test(`then it should spell every code as expected for case ${caseNumber + 1}`, () => {
            assert.deepEqual(
                [vector.entrySecret, vector.viewKey, vector.recoveryCode].map((hex) =>
                    encodeCrockfordBase32(decodeHex(hex)),
                ),
                [vector.entrySecretText, vector.viewKeyText, vector.recoveryCodeText],
            );
        });
    }
});

describe("Using encodeCrockfordBase32, when encoding a 128-bit entry code", () => {
    test("then it should use 26 characters", () => {
        assert.equal(encodeCrockfordBase32(new Uint8Array(16).fill(255)), "ZZZZZZZZZZZZZZZZZZZZZZZZZW");
    });
});
