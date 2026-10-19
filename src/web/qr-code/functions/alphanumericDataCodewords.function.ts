import { qrAlphanumericCharacters } from "../consts/qrAlphanumericCharacters.const.ts";
import type { IQrVersion } from "../interfaces/IQrVersion.ts";
import { bitsOf } from "./bitsOf.function.ts";

const valueOf = (character: string): number => qrAlphanumericCharacters.indexOf(character);

/**
 * Mode 0010, a 9-bit character count, then 11 bits per pair of characters and 6 for a last single one; a terminator
 * of up to four zeros, zeros to the next byte, and the pad bytes 0xEC and 0x11 in turn until the data is full.
 */
export const alphanumericDataCodewords = (text: string, version: IQrVersion): number[] => {
    const bits = [...bitsOf(0b0010, 4), ...bitsOf(text.length, 9)];
    for (let i = 0; i < text.length; i += 2) {
        const pair = text.slice(i, i + 2);
        bits.push(
            ...(pair.length === 2
                ? bitsOf(valueOf(pair[0] ?? "") * 45 + valueOf(pair[1] ?? ""), 11)
                : bitsOf(valueOf(pair), 6)),
        );
    }
    const capacityBits = version.dataCodewords * 8;
    bits.push(...Array.from({ length: Math.min(4, capacityBits - bits.length) }, () => 0));
    bits.push(...Array.from({ length: (8 - (bits.length % 8)) % 8 }, () => 0));
    const codewords = Array.from({ length: bits.length / 8 }, (_, i) =>
        parseInt(bits.slice(i * 8, i * 8 + 8).join(""), 2),
    );
    const padCount = version.dataCodewords - codewords.length;
    return [...codewords, ...Array.from({ length: padCount }, (_, i) => (i % 2 === 0 ? 0xec : 0x11))];
};
