/**
 * Gambling words, kept off every page a buyer sees so a free waitlist is never presented as a game of chance. Matched
 * as whole words in any inflection, so "withdraw" and "drawer" pass.
 */
export const wordsKeptOffBuyerPages =
    /\b(?:lotter(?:y|ies)|raffl(?:e|es|ed|ing)|draw(?:s|n|ing|ings)?|prizes?|winners?)\b/gu;
