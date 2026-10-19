import { lowerCaseHexPattern } from "../consts/lowerCaseHexPattern.const.ts";
import type { ByteArray } from "../types/ByteArray.type.ts";

export const decodeHex = (hex: string): ByteArray => {
    if (!lowerCaseHexPattern.test(hex)) throw new TypeError("expected lower-case hex with an even length");
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < bytes.length; i++) bytes[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    return bytes;
};
