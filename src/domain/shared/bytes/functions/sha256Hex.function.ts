import type { Bytes32Hex } from "../types/Bytes32Hex.type.ts";
import { hexOfDigest } from "./hexOfDigest.function.ts";
import { sha256OfConcatenatedParts } from "./sha256OfConcatenatedParts.function.ts";

export const sha256Hex = async (...parts: readonly Uint8Array[]): Promise<Bytes32Hex> =>
    hexOfDigest(await sha256OfConcatenatedParts(...parts));
