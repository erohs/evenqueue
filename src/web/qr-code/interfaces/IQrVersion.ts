/** One QR symbol size at error correction level M, with a single block of codewords. */
export interface IQrVersion {
    readonly version: number;
    /** Modules per side, without the quiet zone. */
    readonly size: number;
    readonly dataCodewords: number;
    readonly errorCorrectionCodewords: number;
    readonly alphanumericCapacity: number;
    /** Row and column of the one alignment pattern's centre, or null for version 1. */
    readonly alignmentCentre: number | null;
}
