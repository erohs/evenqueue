import assert from "node:assert/strict";
import { describe, test } from "node:test";
import vectors from "#tests/vectors/buyerCodes.json" with { type: "json" };
import { decodeHex } from "#domain/shared/bytes/functions/decodeHex.function.ts";
import { encodeHex } from "#domain/shared/bytes/functions/encodeHex.function.ts";
import { issueBuyerCredentials } from "../functions/issueBuyerCredentials.function.ts";
import { toFormNonce } from "../functions/toFormNonce.function.ts";
import { toServerKey } from "../functions/toServerKey.function.ts";

const first = vectors.cases[0] ?? assert.fail();
const entryKey = toServerKey(decodeHex(first.entryKey));
const formNonce = toFormNonce(decodeHex(first.formNonce));

describe("Using issueBuyerCredentials, when given the shared cross-implementation vectors", () => {
    for (const [caseNumber, vector] of vectors.cases.entries()) {
        test(`then it should produce the expected codes for case ${caseNumber + 1}`, async () => {
            const issued = await issueBuyerCredentials(
                toServerKey(decodeHex(vector.entryKey)),
                toFormNonce(decodeHex(vector.formNonce)),
            );
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
