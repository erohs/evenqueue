import assert from "node:assert/strict";
import { describe, test } from "node:test";
import vectors from "#tests/vectors/buyerCodes.json" with { type: "json" };
import { encodeHex } from "#domain/shared/bytes/functions/encodeHex.function.ts";
import { decodeCrockfordBase32 } from "../functions/decodeCrockfordBase32.function.ts";

const vector = vectors.cases[0] ?? assert.fail();

describe("Using decodeCrockfordBase32, when given a code from the shared vectors", () => {
    test("then it should return the code's bytes", () => {
        const bytes = decodeCrockfordBase32(vector.entrySecretText, 16) ?? assert.fail();
        assert.equal(encodeHex(bytes), vector.entrySecret);
    });
});

describe("Using decodeCrockfordBase32, when the text is the wrong length for the code", () => {
    test("then it should return null", () => {
        assert.equal(decodeCrockfordBase32(vector.entrySecretText.slice(1), 16), null);
    });
});

describe("Using decodeCrockfordBase32, when the text holds a character outside the alphabet", () => {
    test("then it should return null", () => {
        assert.equal(decodeCrockfordBase32(`U${vector.entrySecretText.slice(1)}`, 16), null);
    });
});

describe("Using decodeCrockfordBase32, when the unused final bits are not zero", () => {
    test("then it should return null, so each code has one spelling", () => {
        assert.equal(decodeCrockfordBase32("ZZZZZZZZZZZZZZZZZZZZZZZZZZ", 16), null);
    });
});
