import assert from "node:assert/strict";
import { describe, test } from "node:test";
import vectors from "#tests/vectors/buyerCodes.json" with { type: "json" };
import { encodeHex } from "#domain/shared/bytes/functions/encodeHex.function.ts";
import { readTypedCode } from "../functions/readTypedCode.function.ts";

const vector = vectors.cases[0] ?? assert.fail();
const readRecoveryCode = (typed: string): string | null => {
    const bytes = readTypedCode(typed, 10);
    return bytes === null ? null : encodeHex(bytes);
};

describe("Using readTypedCode, when a code is typed in lower case with spaces and dashes", () => {
    test("then it should read the same code", () => {
        assert.equal(readRecoveryCode(" sm4a s2je–sedv-2s86 "), vector.recoveryCode);
    });
});

describe("Using readTypedCode, when a buyer types letters that look like digits", () => {
    test("then it should read O as zero and I or L as one", () => {
        assert.equal(readRecoveryCode("O000-OOOO-IIII-LLLL"), readRecoveryCode("0000-0000-1111-1111"));
    });
});

describe("Using readTypedCode, when the text cannot be a code", () => {
    test("then it should return null", () => {
        assert.equal(readRecoveryCode("not a code"), null);
    });
});
