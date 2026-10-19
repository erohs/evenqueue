import assert from "node:assert/strict";
import { describe, test } from "node:test";
import vectors from "#tests/vectors/qrCodes.json" with { type: "json" };
import { encodeQrCode } from "../functions/encodeQrCode.function.ts";

const rowsOf = (isDark: readonly (readonly boolean[])[]): string[] =>
    isDark.map((row) => row.map((isModuleDark) => (isModuleDark ? "1" : "0")).join(""));

describe("Using encodeQrCode, for the independently made vectors", () => {
    for (const vector of vectors.cases) {
        test(`then it should match every module for "${vector.text}", mask choice included`, () => {
            assert.deepEqual(rowsOf(encodeQrCode(vector.text)), vector.modules);
        });
    }
});

describe("Using encodeQrCode, when each of the eight masks is forced", () => {
    for (const forced of vectors.byMask.masks) {
        test(`then it should match every module with mask ${forced.mask}`, () => {
            assert.deepEqual(rowsOf(encodeQrCode(vectors.byMask.text, forced.mask)), forced.modules);
        });
    }
});

describe("Using encodeQrCode, for text it cannot hold", () => {
    test("then it should refuse lower case, other characters and anything over 61 characters", () => {
        for (const text of ["abc", "A_B", "É", "A".repeat(62)]) assert.throws(() => encodeQrCode(text), RangeError);
    });
});
