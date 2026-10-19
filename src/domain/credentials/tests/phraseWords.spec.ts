import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { wordsKeptOffBuyerPagesIn } from "#domain/shared/text/functions/wordsKeptOffBuyerPagesIn.function.ts";
import { phraseWords } from "../consts/phraseWords.const.ts";

describe("Using the phrase word list", () => {
    test("then it should hold 7,760 distinct words in sorted order, as the phrase vectors assume", () => {
        assert.deepEqual(
            [phraseWords.length, new Set(phraseWords).size, phraseWords.toSorted().join()],
            [7_760, 7_760, phraseWords.join()],
        );
    });

    test("then every word should be plain lower-case letters, so typing it can't go wrong", () => {
        assert.deepEqual(
            phraseWords.filter((word) => !/^[a-z]{3,9}$/u.test(word)),
            [],
        );
    });

    test("then no word should be one kept off buyer pages, because phrases are shown to buyers", () => {
        assert.deepEqual(wordsKeptOffBuyerPagesIn(phraseWords.join(" ")), []);
    });
});
