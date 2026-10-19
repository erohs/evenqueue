import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { qrVersionsAtLevelM } from "../consts/qrVersionsAtLevelM.const.ts";
import { alphanumericDataCodewords } from "../functions/alphanumericDataCodewords.function.ts";

/** The first 20 bytes are segno's encoding of the text and terminator; ISO/IEC 18004 7.4.9 puts pad bytes straight after. */
const expected = [
    32, 213, 237, 165, 83, 230, 199, 169, 139, 216, 29, 102, 21, 147, 28, 147, 105, 211, 48, 16, 236, 17, 236, 17, 236,
    17, 236, 17,
];

describe("Using alphanumericDataCodewords, for a 26-character buyer code whose terminator ends on a byte boundary", () => {
    test("then it should go straight to the pad bytes, adding no zero byte", () => {
        const version = qrVersionsAtLevelM[1] ?? assert.fail();
        assert.deepEqual(alphanumericDataCodewords("XWTHSDVSEYXV2RR3VW53RRKYH4", version), expected);
    });
});
