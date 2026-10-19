import type { ByteArray } from "../types/ByteArray.type.ts";
import type { Bytes32Hex } from "../types/Bytes32Hex.type.ts";
import { encodeHex } from "./encodeHex.function.ts";

/** The hex of a SHA-256 or HMAC-SHA-256 digest, which is always 32 bytes: the one place a digest becomes a Bytes32Hex. */
export const hexOfDigest = (digest: ByteArray): Bytes32Hex => encodeHex(digest) as Bytes32Hex;
