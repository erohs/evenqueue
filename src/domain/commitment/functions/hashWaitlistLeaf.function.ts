import { assertBytes32Hex } from "#domain/shared/bytes/functions/assertBytes32Hex.function.ts";
import { decodeHex } from "#domain/shared/bytes/functions/decodeHex.function.ts";
import { sha256OfConcatenatedParts } from "#domain/shared/bytes/functions/sha256OfConcatenatedParts.function.ts";
import type { ByteArray } from "#domain/shared/bytes/types/ByteArray.type.ts";
import { merkleHashPrefixes } from "../consts/merkleHashPrefixes.const.ts";
import type { IWaitlistLeaf } from "../interfaces/IWaitlistLeaf.ts";
import { encodePriority } from "./encodePriority.function.ts";

/** SHA-256(0x00 ‖ publicDrawId ‖ priority as 4 signed big-endian bytes). */
export const hashWaitlistLeaf = async (leaf: IWaitlistLeaf): Promise<ByteArray> => {
    assertBytes32Hex(leaf.publicDrawId, "publicDrawId");
    return sha256OfConcatenatedParts(
        merkleHashPrefixes.leaf,
        decodeHex(leaf.publicDrawId),
        encodePriority(leaf.priority),
    );
};
