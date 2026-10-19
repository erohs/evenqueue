import type { ByteArray } from "../types/ByteArray.type.ts";
import type { Bytes32Hex } from "../types/Bytes32Hex.type.ts";
import { hexOfDigest } from "./hexOfDigest.function.ts";
import { hmacSha256OfConcatenatedParts } from "./hmacSha256OfConcatenatedParts.function.ts";

export const hmacSha256Hex = async (key: ByteArray, ...parts: readonly Uint8Array[]): Promise<Bytes32Hex> =>
    hexOfDigest(await hmacSha256OfConcatenatedParts(key, ...parts));
