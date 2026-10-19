export const crockfordBase32Length = (byteLength: number): number => Math.ceil((byteLength * 8) / 5);
