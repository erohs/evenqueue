import type { ByteArray } from "../types/ByteArray.type.ts";

export const concatenateBytes = (...parts: readonly Uint8Array[]): ByteArray => {
    const joined = new Uint8Array(parts.reduce((totalLength, part) => totalLength + part.length, 0));
    let writeOffset = 0;
    for (const part of parts) {
        joined.set(part, writeOffset);
        writeOffset += part.length;
    }
    return joined;
};
