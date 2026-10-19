import type { ByteArray } from "#domain/shared/bytes/types/ByteArray.type.ts";
import { crockfordBase32Alphabet } from "../consts/crockfordBase32Alphabet.const.ts";
import { crockfordBase32Length } from "./crockfordBase32Length.function.ts";

/**
 * Expects normalised text. Returns null for the wrong length, a character outside the alphabet, or padding bits that
 * are not zero, so every code has exactly one spelling.
 */
export const decodeCrockfordBase32 = (text: string, byteLength: number): ByteArray | null => {
    if (text.length !== crockfordBase32Length(byteLength)) return null;
    const bytes = new Uint8Array(byteLength);
    let pendingBits = 0;
    let pendingBitCount = 0;
    let writeIndex = 0;
    for (const character of text) {
        const value = crockfordBase32Alphabet.indexOf(character);
        if (value < 0) return null;
        pendingBits = (pendingBits << 5) | value;
        pendingBitCount += 5;
        if (pendingBitCount < 8) continue;
        pendingBitCount -= 8;
        bytes[writeIndex] = (pendingBits >> pendingBitCount) & 255;
        writeIndex += 1;
        pendingBits &= (1 << pendingBitCount) - 1;
    }
    return pendingBits === 0 ? bytes : null;
};
