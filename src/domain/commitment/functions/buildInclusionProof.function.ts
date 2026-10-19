import { encodeHex } from "#domain/shared/bytes/functions/encodeHex.function.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import type { IMerkleProofStep } from "../interfaces/IMerkleProofStep.ts";
import type { IWaitlistLeaf } from "../interfaces/IWaitlistLeaf.ts";
import { buildMerkleLevels } from "./buildMerkleLevels.function.ts";
import { hashWaitlistLeaf } from "./hashWaitlistLeaf.function.ts";
import { sortLeavesForCommitment } from "./sortLeavesForCommitment.function.ts";

/** The sibling hashes from a buyer's leaf up to the root, or null if no leaf has that public draw id. */
export const buildInclusionProof = async (
    leaves: readonly IWaitlistLeaf[],
    publicDrawId: Bytes32Hex,
): Promise<IMerkleProofStep[] | null> => {
    const sorted = sortLeavesForCommitment(leaves);
    let position = sorted.findIndex((leaf) => leaf.publicDrawId === publicDrawId);
    if (position < 0) return null;
    const levels = await buildMerkleLevels(await Promise.all(sorted.map(hashWaitlistLeaf)));
    const proof: IMerkleProofStep[] = [];
    for (const level of levels.slice(0, -1)) {
        const siblingPosition = position ^ 1;
        const sibling = level[siblingPosition];
        if (sibling !== undefined) {
            proof.push({ siblingHash: encodeHex(sibling), isSiblingOnLeft: siblingPosition < position });
        }
        position >>= 1;
    }
    return proof;
};
