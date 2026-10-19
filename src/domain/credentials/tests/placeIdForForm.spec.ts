import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { deterministicBytes32Hex } from "#tests/support/functions/deterministicBytes32Hex.function.ts";
import { decodeHex } from "#domain/shared/bytes/functions/decodeHex.function.ts";
import { issueBuyerCredentials } from "../functions/issueBuyerCredentials.function.ts";
import { placeIdForForm } from "../functions/placeIdForForm.function.ts";
import { toFormNonce } from "../functions/toFormNonce.function.ts";
import { toServerKey } from "../functions/toServerKey.function.ts";
import { encodeHex } from "#domain/shared/bytes/functions/encodeHex.function.ts";

const entryKey = toServerKey(decodeHex(deterministicBytes32Hex("entry key")));
const nonce = toFormNonce(decodeHex("00112233445566778899aabbccddeeff"));
const otherNonce = toFormNonce(decodeHex("ffeeddccbbaa99887766554433221100"));

describe("Using placeIdForForm, when the same form is sent twice", () => {
    test("then it should name the same place both times", async () => {
        assert.equal(await placeIdForForm(entryKey, nonce), await placeIdForForm(entryKey, nonce));
    });
});

describe("Using placeIdForForm, when two forms are sent", () => {
    test("then it should name two places", async () => {
        assert.notEqual(await placeIdForForm(entryKey, nonce), await placeIdForForm(entryKey, otherNonce));
    });
});

describe("Using placeIdForForm, for the form that issued a buyer's codes", () => {
    test("then the place id should not be any of the codes' bytes", async () => {
        const codes = await issueBuyerCredentials(entryKey, nonce);
        const placeId = await placeIdForForm(entryKey, nonce);
        for (const code of [codes.entrySecret, codes.viewKey, codes.recoveryCode]) {
            assert.equal(placeId.includes(encodeHex(code)), false);
        }
    });
});
