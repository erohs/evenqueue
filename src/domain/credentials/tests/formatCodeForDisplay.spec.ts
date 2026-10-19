import assert from "node:assert/strict";
import { describe, test } from "node:test";
import vectors from "#tests/vectors/buyerCodes.json" with { type: "json" };
import { decodeHex } from "#domain/shared/bytes/functions/decodeHex.function.ts";
import { formatCodeForDisplay } from "../functions/formatCodeForDisplay.function.ts";

const vector = vectors.cases[0] ?? assert.fail();

describe("Using formatCodeForDisplay, when showing a recovery code", () => {
    test("then it should split it into four groups of four", () => {
        assert.equal(formatCodeForDisplay(decodeHex(vector.recoveryCode)), "SM4A-S2JE-SEDV-2S86");
    });
});

describe("Using formatCodeForDisplay, when showing an entry code", () => {
    test("then it should end with the two characters left over", () => {
        assert.equal(formatCodeForDisplay(decodeHex(vector.entrySecret)), "XWTH-SDVS-EYXV-2RR3-VW53-RRKY-H4");
    });
});
