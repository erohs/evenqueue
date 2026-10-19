import { decodeHex } from "#domain/shared/bytes/functions/decodeHex.function.ts";
import { encodeHex } from "#domain/shared/bytes/functions/encodeHex.function.ts";
import { sha256OfConcatenatedParts } from "#domain/shared/bytes/functions/sha256OfConcatenatedParts.function.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import { merkleHashPrefixes } from "../consts/merkleHashPrefixes.const.ts";
import type { IMerkleProofStep } from "../interfaces/IMerkleProofStep.ts";
import type { IWaitlistLeaf } from "../interfaces/IWaitlistLeaf.ts";
import { hashWaitlistLeaf } from "./hashWaitlistLeaf.function.ts";

/** Lets a buyer confirm their own place was committed, from one leaf and its proof alone. */
export const isLeafInWaitlistRoot = async (
    leaf: IWaitlistLeaf,
    proof: readonly IMerkleProofStep[],
    committedWaitlistRoot: Bytes32Hex,
): Promise<boolean> => {
    let current = await hashWaitlistLeaf(leaf);
    for (const step of proof) {
        const sibling = decodeHex(step.siblingHash);
        const [left, right] = step.isSiblingOnLeft ? [sibling, current] : [current, sibling];
        current = await sha256OfConcatenatedParts(merkleHashPrefixes.node, left, right);
    }
    return encodeHex(current) === committedWaitlistRoot;
};
