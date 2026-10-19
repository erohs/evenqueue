import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { wordsKeptOffBuyerPagesIn } from "../functions/wordsKeptOffBuyerPagesIn.function.ts";

describe("Using wordsKeptOffBuyerPagesIn, when text uses gambling words in any inflection or case", () => {
    test("then it should find each word once, in lower case", () => {
        assert.deepEqual(wordsKeptOffBuyerPagesIn("Lotteries! The DRAWING, then raffled prizes; a draw and a draw."), [
            "lotteries",
            "drawing",
            "raffled",
            "prizes",
            "draw",
        ]);
    });
});

describe("Using wordsKeptOffBuyerPagesIn, when a word only contains one of them", () => {
    test("then it should find nothing in withdraw, drawer or winnings", () => {
        assert.deepEqual(wordsKeptOffBuyerPagesIn("Withdraw from the drawer; no winnings."), []);
    });
});

describe("Using wordsKeptOffBuyerPagesIn, when a word is hidden with full-width or invisible characters", () => {
    test("then it should still find it", () => {
        assert.deepEqual(wordsKeptOffBuyerPagesIn("ｗｉｎｎｅｒ and pri​ze"), ["winner", "prize"]);
    });
});
