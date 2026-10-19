import { knownPhraseWords } from "../consts/knownPhraseWords.const.ts";
import { maximumTypedCodeLength } from "../consts/maximumTypedCodeLength.const.ts";
import { typedPhraseWordCount } from "../consts/typedPhraseWordCount.const.ts";

const longestTypedPhrase = maximumTypedCodeLength * 2;

/**
 * Reads a phrase as a buyer typed or pasted it: any case, any spacing or punctuation between words. Null unless it is
 * exactly seven words from the list.
 */
export const readTypedPhrase = (typed: string): readonly string[] | null => {
    if (typed.length > longestTypedPhrase) return null;
    const words = typed
        .normalize("NFKC")
        .toLowerCase()
        .split(/[^a-z]+/u)
        .filter((word) => word !== "");
    const isPhrase = words.length === typedPhraseWordCount && words.every((word) => knownPhraseWords.has(word));
    return isPhrase ? words : null;
};
