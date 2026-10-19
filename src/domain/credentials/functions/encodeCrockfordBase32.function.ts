import { crockfordBase32Alphabet } from "../consts/crockfordBase32Alphabet.const.ts";

/** Five bits per character, most significant first. A final partial character is padded with zero bits. */
export const encodeCrockfordBase32 = (bytes: Uint8Array): string => {
    let pendingBits = 0;
    let pendingBitCount = 0;
    let text = "";
    for (const byte of bytes) {
        pendingBits = (pendingBits << 8) | byte;
        pendingBitCount += 8;
        while (pendingBitCount >= 5) {
            pendingBitCount -= 5;
            text += crockfordBase32Alphabet.charAt((pendingBits >> pendingBitCount) & 31);
        }
        pendingBits &= (1 << pendingBitCount) - 1;
    }
    if (pendingBitCount > 0) text += crockfordBase32Alphabet.charAt((pendingBits << (5 - pendingBitCount)) & 31);
    return text;
};
