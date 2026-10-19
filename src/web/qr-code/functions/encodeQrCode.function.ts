import { qrAlphanumericCharacters } from "../consts/qrAlphanumericCharacters.const.ts";
import { qrVersionsAtLevelM } from "../consts/qrVersionsAtLevelM.const.ts";
import { alphanumericDataCodewords } from "./alphanumericDataCodewords.function.ts";
import { createFunctionPatterns } from "./createFunctionPatterns.function.ts";
import { formatInformationBits } from "./formatInformationBits.function.ts";
import { formatInformationPositions } from "./formatInformationPositions.function.ts";
import { maskPenalty } from "./maskPenalty.function.ts";
import { maskedModules } from "./maskedModules.function.ts";
import { placeCodewords } from "./placeCodewords.function.ts";
import { reedSolomonRemainder } from "./reedSolomonRemainder.function.ts";

/**
 * A QR code for short alphanumeric text, such as a buyer's code: the smallest version that fits, level M, and the
 * mask with the lowest penalty (the first on a tie). Rows from the top, true for dark, without the quiet zone.
 */
export const encodeQrCode = (text: string, mask: number | null = null): boolean[][] => {
    const version = qrVersionsAtLevelM.find((candidate) => text.length <= candidate.alphanumericCapacity);
    if (version === undefined || ![...text].every((character) => qrAlphanumericCharacters.includes(character))) {
        throw new RangeError("a QR code here holds at most 61 characters of QR alphanumeric text");
    }
    const data = alphanumericDataCodewords(text, version);
    const modules = createFunctionPatterns(version);
    placeCodewords(modules, [...data, ...reedSolomonRemainder(data, version.errorCorrectionCodewords)]);
    const candidates = Array.from({ length: 8 }, (_, candidate) => maskedModules(modules, candidate));
    const penalties = candidates.map(maskPenalty);
    const chosen = mask ?? penalties.indexOf(Math.min(...penalties));
    const isDark = candidates[chosen] ?? [];
    const bits = formatInformationBits(chosen);
    for (const copy of formatInformationPositions(version.size)) {
        copy.forEach(([row, column], bit) => ((isDark[row] ?? [])[column] = ((bits >>> bit) & 1) === 1));
    }
    (isDark[version.size - 8] ?? [])[8] = true;
    return isDark;
};
