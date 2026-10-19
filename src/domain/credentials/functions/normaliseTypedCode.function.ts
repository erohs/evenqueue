import { crockfordLookAlikes } from "../consts/crockfordLookAlikes.const.ts";

const spacesAndDashes = /[\s\-‐-―−]/gu;
const lookAlikeLetters = /[OIL]/gu;

/**
 * Accepts a code however it was typed, pasted or read aloud: any case, full-width characters from some keyboards,
 * spaces or any kind of dash, and O, I or L for the digits they look like.
 */
export const normaliseTypedCode = (typed: string): string =>
    typed
        .normalize("NFKC")
        .toUpperCase()
        .replace(spacesAndDashes, "")
        .replace(lookAlikeLetters, (letter) => crockfordLookAlikes.get(letter) ?? letter);
