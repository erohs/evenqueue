import { wordsKeptOffBuyerPagesIn } from "./wordsKeptOffBuyerPagesIn.function.ts";

const controlCharactersExceptLineBreaks = /[\p{Cc}--[\n\r]]/v;
const anyControlCharacter = /\p{Cc}/u;

/** Vendor text shown on buyer pages: escaped when rendered, but checked here for length, control characters and copy. */
export const buyerFacingTextProblems = (
    fieldName: string,
    text: string,
    maximumCharacters: number,
    canBreakLines: boolean,
): string[] => {
    if (!text.isWellFormed()) return [`${fieldName} is not well-formed text`];
    const forbiddenControls = canBreakLines ? controlCharactersExceptLineBreaks : anyControlCharacter;
    const bannedWords = wordsKeptOffBuyerPagesIn(text);
    return [
        ...([...text].length > maximumCharacters
            ? [`${fieldName} is longer than ${maximumCharacters} characters`]
            : []),
        ...(forbiddenControls.test(text) ? [`${fieldName} holds control characters`] : []),
        ...(bannedWords.length > 0 ? [`${fieldName} uses words kept off buyer pages: ${bannedWords.join(", ")}`] : []),
    ];
};
