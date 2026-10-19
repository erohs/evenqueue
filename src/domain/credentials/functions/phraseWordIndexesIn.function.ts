import { phraseWords } from "../consts/phraseWords.const.ts";

/**
 * Word indexes read from a block of random bytes as big-endian 16-bit values. Values at or above the largest whole
 * multiple of the list's length are skipped, so every word is exactly as likely as every other.
 */
export const phraseWordIndexesIn = (block: Uint8Array): number[] => {
    const acceptedBelow = phraseWords.length * Math.floor(65_536 / phraseWords.length);
    const indexes: number[] = [];
    for (let i = 0; i + 1 < block.length; i += 2) {
        const value = ((block[i] ?? 0) << 8) | (block[i + 1] ?? 0);
        if (value < acceptedBelow) indexes.push(value % phraseWords.length);
    }
    return indexes;
};
