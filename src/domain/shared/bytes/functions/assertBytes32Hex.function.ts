import type { Bytes32Hex } from "../types/Bytes32Hex.type.ts";
import { isBytes32Hex } from "./isBytes32Hex.function.ts";

/** Throws unless the value is 32 bytes of lower-case hex, so a malformed value can never be hashed silently. */
export const assertBytes32Hex: (value: string, nameForErrorMessage: string) => asserts value is Bytes32Hex = (
    value,
    nameForErrorMessage,
) => {
    if (!isBytes32Hex(value)) throw new TypeError(`${nameForErrorMessage} must be 64 lower-case hex characters`);
};
