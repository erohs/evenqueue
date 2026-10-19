import type { IQrVersion } from "../interfaces/IQrVersion.ts";

/**
 * From ISO/IEC 18004 tables 7 and 9. Versions 1 to 3 cover every buyer code (26 characters needs version 2) and keep
 * one block of codewords, so no interleaving is needed. Level M survives about 15% damage, enough for a crumpled print.
 */
export const qrVersionsAtLevelM: readonly IQrVersion[] = [
    {
        version: 1,
        size: 21,
        dataCodewords: 16,
        errorCorrectionCodewords: 10,
        alphanumericCapacity: 20,
        alignmentCentre: null,
    },
    {
        version: 2,
        size: 25,
        dataCodewords: 28,
        errorCorrectionCodewords: 16,
        alphanumericCapacity: 38,
        alignmentCentre: 18,
    },
    {
        version: 3,
        size: 29,
        dataCodewords: 44,
        errorCorrectionCodewords: 26,
        alphanumericCapacity: 61,
        alignmentCentre: 22,
    },
];
