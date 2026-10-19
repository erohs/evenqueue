import { bytes32HexPattern } from "../consts/bytes32HexPattern.const.ts";
import type { Bytes32Hex } from "../types/Bytes32Hex.type.ts";

export const isBytes32Hex = (value: unknown): value is Bytes32Hex =>
    typeof value === "string" && bytes32HexPattern.test(value);
