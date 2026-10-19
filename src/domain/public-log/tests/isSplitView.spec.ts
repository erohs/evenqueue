import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { toCount } from "#domain/shared/counting/functions/toCount.function.ts";
import { deterministicBytes32Hex } from "#tests/support/functions/deterministicBytes32Hex.function.ts";
import { isSplitView } from "../functions/isSplitView.function.ts";

const five = toCount(5);
const six = toCount(6);
const head = deterministicBytes32Hex("head");
const otherHead = deterministicBytes32Hex("other-head");

describe("Using isSplitView, when two buyers repost checkpoints of the same size with different heads", () => {
    test("then it should report a split view", () => {
        assert.equal(
            isSplitView({ entryCount: five, headHash: head }, { entryCount: five, headHash: otherHead }),
            true,
        );
    });
});

describe("Using isSplitView, when the checkpoints match", () => {
    test("then it should not report one", () => {
        assert.equal(isSplitView({ entryCount: five, headHash: head }, { entryCount: five, headHash: head }), false);
    });
});

describe("Using isSplitView, when the checkpoints differ in size", () => {
    test("then it should not decide alone, because the full log is needed", () => {
        assert.equal(
            isSplitView({ entryCount: five, headHash: head }, { entryCount: six, headHash: otherHead }),
            false,
        );
    });
});
