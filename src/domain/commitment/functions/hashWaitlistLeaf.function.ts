import { decodeHex } from "#domain/shared/bytes/functions/decodeHex.function.ts";
import { sha256OfConcatenatedParts } from "#domain/shared/bytes/functions/sha256OfConcatenatedParts.function.ts";
import type { ByteArray } from "#domain/shared/bytes/types/ByteArray.type.ts";
import { merkleHashPrefixes } from "../consts/merkleHashPrefixes.const.ts";
import type { IWaitlistLeaf } from "../interfaces/IWaitlistLeaf.ts";
import { encodePriority } from "./encodePriority.function.ts";

/** SHA-256(0x00 ‖ publicDrawId ‖ priority as 4 signed big-endian bytes). */
export const hashWaitlistLeaf = (leaf: IWaitlistLeaf): Promise<ByteArray> =>
    sha256OfConcatenatedParts(merkleHashPrefixes.leaf, decodeHex(leaf.publicDrawId), encodePriority(leaf.priority));
