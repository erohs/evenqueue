import { wordsKeptOffBuyerPages } from "../consts/wordsKeptOffBuyerPages.const.ts";
import { normaliseIdentifier } from "./normaliseIdentifier.function.ts";

/** Each distinct word found, in lower case, after folding look-alike and invisible characters. */
export const wordsKeptOffBuyerPagesIn = (text: string): string[] => [
    ...new Set(normaliseIdentifier(text).match(wordsKeptOffBuyerPages) ?? []),
];
