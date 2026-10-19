import assert from "node:assert/strict";
import { describe, test } from "node:test";
import vectors from "#tests/vectors/buyerCodes.json" with { type: "json" };
import { decodeHex } from "#domain/shared/bytes/functions/decodeHex.function.ts";
import { storedFormOfCredentials } from "../functions/storedFormOfCredentials.function.ts";
import { toServerKey } from "../functions/toServerKey.function.ts";

const issuedFrom = (vector: (typeof vectors.cases)[number]) => ({
    entrySecret: decodeHex(vector.entrySecret),
    viewKey: decodeHex(vector.viewKey),
    recoveryCode: decodeHex(vector.recoveryCode),
});

describe("Using storedFormOfCredentials, when given the shared cross-implementation vectors", () => {
    for (const [caseNumber, vector] of vectors.cases.entries()) {
        test(`then it should produce the expected stored values for case ${caseNumber + 1}`, async () => {
            assert.deepEqual(
                await storedFormOfCredentials(issuedFrom(vector), toServerKey(decodeHex(vector.seriesKey))),
                {
                    entrySecretLookup: vector.entrySecretLookup,
                    viewKeyLookup: vector.viewKeyLookup,
                    recoveryCodeCheck: vector.recoveryCodeCheck,
                    placeTag: vector.placeTag,
                },
            );
        });
    }
});

describe("Using storedFormOfCredentials, when the series key changes", () => {
    test("then it should change the recovery code check", async () => {
        const vector = vectors.cases[0] ?? assert.fail();
        const otherSeriesKey = toServerKey(decodeHex(vectors.cases[1]?.seriesKey ?? assert.fail()));
        const stored = await storedFormOfCredentials(issuedFrom(vector), otherSeriesKey);
        assert.notEqual(stored.recoveryCodeCheck, vector.recoveryCodeCheck);
    });
});
