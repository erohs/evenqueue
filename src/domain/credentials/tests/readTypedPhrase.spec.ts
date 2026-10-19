import assert from "node:assert/strict";
import { describe, test } from "node:test";
import vectors from "#tests/vectors/buyerCodes.json" with { type: "json" };
import { readTypedPhrase } from "../functions/readTypedPhrase.function.ts";

const phrase = (vectors.cases[0] ?? assert.fail()).typedPhrase;

describe("Using readTypedPhrase, when the phrase is typed with any case, spacing or punctuation", () => {
    test("then it should read the same seven words", () => {
        const typed = `  ${phrase.map((word, i) => (i % 2 === 0 ? word.toUpperCase() : word)).join(", ")}.  `;
        assert.deepEqual(readTypedPhrase(typed), phrase);
    });
});

describe("Using readTypedPhrase, when a word is missing, extra or not on the list", () => {
    test("then it should refuse the phrase", () => {
        const typos = [phrase.slice(1), [...phrase, "zoom"], ["zoomm", ...phrase.slice(1)]];
        for (const words of typos) assert.equal(readTypedPhrase(words.join(" ")), null, words.join(" "));
    });
});

describe("Using readTypedPhrase, when an entry code is typed instead", () => {
    test("then it should not read it as a phrase", () => {
        assert.equal(readTypedPhrase("XWTH-SDVS-EYXV-2RR3-VW53-RRKY-H4"), null);
    });
});

describe("Using readTypedPhrase, when the text is far longer than any phrase", () => {
    test("then it should refuse it before splitting it", () => {
        assert.equal(readTypedPhrase(`${phrase.join(" ")} ${" ".repeat(500)}`), null);
    });
});
