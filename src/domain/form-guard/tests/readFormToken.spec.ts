import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { deterministicBytes32Hex } from "#tests/support/functions/deterministicBytes32Hex.function.ts";
import { toFormNonce } from "#domain/credentials/functions/toFormNonce.function.ts";
import { toServerKey } from "#domain/credentials/functions/toServerKey.function.ts";
import { decodeHex } from "#domain/shared/bytes/functions/decodeHex.function.ts";
import { toEpochMilliseconds } from "#domain/shared/time/functions/toEpochMilliseconds.function.ts";
import { readFormToken } from "../functions/readFormToken.function.ts";
import { signFormToken } from "../functions/signFormToken.function.ts";

const key = toServerKey(decodeHex(deterministicBytes32Hex("form guard key")));
const waitlistId = deterministicBytes32Hex("waitlist");
const nonce = toFormNonce(decodeHex("00112233445566778899aabbccddeeff"));
const issuedAt = toEpochMilliseconds(1_760_000_000_000);
const token = await signFormToken(key, "join-waitlist", waitlistId, nonce, issuedAt);
const readAfter = (milliseconds: number, read: unknown = token) =>
    readFormToken(key, "join-waitlist", waitlistId, read, toEpochMilliseconds(issuedAt + milliseconds));

describe("Using readFormToken, when a person sends the form after a few seconds", () => {
    test("then it should accept it and give back the form's nonce", async () => {
        assert.deepEqual(await readAfter(3_000), { kind: "accepted", nonce });
    });
});

describe("Using readFormToken, when the form comes back sooner than a person could send it", () => {
    test("then it should call it too quick", async () => {
        assert.deepEqual(await readAfter(2_999), { kind: "too-quick" });
    });
});

describe("Using readFormToken, when the token is dated in the future", () => {
    test("then it should call it too quick", async () => {
        assert.deepEqual(await readAfter(-60_000), { kind: "too-quick" });
    });
});

describe("Using readFormToken, when the form is more than a day old", () => {
    test("then it should call it expired", async () => {
        assert.deepEqual(await readAfter(86_400_001), { kind: "expired" });
    });
});

describe("Using readFormToken, when the token was signed for the recovery form", () => {
    test("then the entry form should refuse it", async () => {
        const recoveryToken = await signFormToken(key, "request-recovery", waitlistId, nonce, issuedAt);
        assert.deepEqual(await readAfter(5_000, recoveryToken), { kind: "not-genuine" });
    });
});

describe("Using readFormToken, when the token was signed for another waitlist", () => {
    test("then it should refuse it", async () => {
        const otherToken = await signFormToken(key, "join-waitlist", deterministicBytes32Hex("other"), nonce, issuedAt);
        assert.deepEqual(await readAfter(5_000, otherToken), { kind: "not-genuine" });
    });
});

describe("Using readFormToken, when the time in the token is changed to look older", () => {
    test("then the signature should no longer match", async () => {
        const backdated = token.replace(`.${issuedAt}.`, `.${issuedAt - 10_000}.`);
        assert.deepEqual(await readAfter(5_000, backdated), { kind: "not-genuine" });
    });
});

describe("Using readFormToken, when the field holds anything but a token", () => {
    test("then it should refuse every value without throwing", async () => {
        const junk = [undefined, null, 7, {}, [], "", "a.b.c", `${token}x`, token.toUpperCase(), "9".repeat(10_000)];
        for (const value of junk) {
            const reading = await readFormToken(
                key,
                "join-waitlist",
                waitlistId,
                value,
                toEpochMilliseconds(issuedAt + 5_000),
            );
            assert.deepEqual(reading, { kind: "not-genuine" });
        }
    });
});
