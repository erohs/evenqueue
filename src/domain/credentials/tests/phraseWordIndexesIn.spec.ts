import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { phraseWordIndexesIn } from "../functions/phraseWordIndexesIn.function.ts";

describe("Using phraseWordIndexesIn, for values on either side of the largest whole multiple of 7,760", () => {
    test("then it should keep 62,079 as the last word and skip 62,080 and above", () => {
        assert.deepEqual(
            phraseWordIndexesIn(Uint8Array.of(0xf2, 0x7f, 0xf2, 0x80, 0xff, 0xff, 0x00, 0x01)),
            [7_759, 1],
        );
    });
});

describe("Using phraseWordIndexesIn, for a block with an odd byte at the end", () => {
    test("then it should ignore the odd byte", () => {
        assert.deepEqual(phraseWordIndexesIn(Uint8Array.of(0x00, 0x02, 0x00)), [2]);
    });
});
