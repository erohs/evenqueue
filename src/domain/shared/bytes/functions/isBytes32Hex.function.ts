import { bytes32HexPattern } from "../consts/bytes32HexPattern.const.ts";
import type { Bytes32Hex } from "../types/Bytes32Hex.type.ts";

export const isBytes32Hex = (value: string): value is Bytes32Hex => bytes32HexPattern.test(value);
