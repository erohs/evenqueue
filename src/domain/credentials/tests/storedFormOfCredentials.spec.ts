import assert from "node:assert/strict";
import { describe, test } from "node:test";
import vectors from "#tests/vectors/buyerCodes.json" with { type: "json" };
import { decodeHex } from "#domain/shared/bytes/functions/decodeHex.function.ts";
import { storedFormOfCredentials } from "../functions/storedFormOfCredentials.function.ts";

describe("Using storedFormOfCredentials, when given the shared cross-implementation vectors", () => {
    for (const [caseNumber, vector] of vectors.cases.entries()) {
        test(`then it should produce the expected stored values for case ${caseNumber + 1}`, async () => {
            const issued = {
                entrySecret: decodeHex(vector.entrySecret),
                viewKey: decodeHex(vector.viewKey),
                recoveryCode: decodeHex(vector.recoveryCode),
            };
            assert.deepEqual(await storedFormOfCredentials(issued, decodeHex(vector.seriesKey)), {
                entrySecretLookup: vector.entrySecretLookup,
                viewKeyLookup: vector.viewKeyLookup,
                recoveryCodeCheck: vector.recoveryCodeCheck,
            });
        });
    }
});

describe("Using storedFormOfCredentials, when the series key changes", () => {
    test("then it should change the recovery code check", async () => {
        const vector = vectors.cases[0] ?? assert.fail();
        const issued = {
            entrySecret: decodeHex(vector.entrySecret),
            viewKey: decodeHex(vector.viewKey),
            recoveryCode: decodeHex(vector.recoveryCode),
        };
        const otherSeriesKey = decodeHex(vectors.cases[1]?.seriesKey ?? assert.fail());
        const stored = await storedFormOfCredentials(issued, otherSeriesKey);
        assert.notEqual(stored.recoveryCodeCheck, vector.recoveryCodeCheck);
    });
});
