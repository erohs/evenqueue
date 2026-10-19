import assert from "node:assert/strict";
import { describe, test } from "node:test";
import vectors from "#tests/vectors/buyerCodes.json" with { type: "json" };
import { decodeHex } from "#domain/shared/bytes/functions/decodeHex.function.ts";
import { encodeHex } from "#domain/shared/bytes/functions/encodeHex.function.ts";
import { issueBuyerCredentials } from "../functions/issueBuyerCredentials.function.ts";

const entryKey = decodeHex(vectors.cases[0]?.entryKey ?? assert.fail());
const formNonce = decodeHex(vectors.cases[0]?.formNonce ?? assert.fail());

describe("Using issueBuyerCredentials, when given the shared cross-implementation vectors", () => {
    for (const [caseNumber, vector] of vectors.cases.entries()) {
        test(`then it should produce the expected codes for case ${caseNumber + 1}`, async () => {
            const issued = await issueBuyerCredentials(decodeHex(vector.entryKey), decodeHex(vector.formNonce));
            assert.deepEqual(
                [encodeHex(issued.entrySecret), encodeHex(issued.viewKey), encodeHex(issued.recoveryCode)],
                [vector.entrySecret, vector.viewKey, vector.recoveryCode],
            );
        });
    }
});

describe("Using issueBuyerCredentials, when the same form is submitted twice", () => {
    test("then it should issue the same codes both times", async () => {
        assert.deepEqual(
            await issueBuyerCredentials(entryKey, formNonce),
            await issueBuyerCredentials(entryKey, formNonce),
        );
    });
});

describe("Using issueBuyerCredentials, when the form nonce is too short to be unguessable", () => {
    test("then it should refuse it", async () => {
        await assert.rejects(issueBuyerCredentials(entryKey, formNonce.slice(0, 15)), RangeError);
    });
});
