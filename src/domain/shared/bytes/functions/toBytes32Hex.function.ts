import type { Bytes32Hex } from "../types/Bytes32Hex.type.ts";
import { isBytes32Hex } from "./isBytes32Hex.function.ts";

export const toBytes32Hex = (value: string): Bytes32Hex => {
    if (!isBytes32Hex(value)) throw new TypeError("expected 64 lower-case hex characters");
    return value;
};
