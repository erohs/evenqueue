import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import type { IMerkleProofStep } from "../interfaces/IMerkleProofStep.ts";
import type { IWaitlistLeaf } from "../interfaces/IWaitlistLeaf.ts";
import { buildMerkleTree } from "./buildMerkleTree.function.ts";
import { hashWaitlistLeaf } from "./hashWaitlistLeaf.function.ts";
import { inclusionProofFromLevels } from "./inclusionProofFromLevels.function.ts";
import { sortLeavesForCommitment } from "./sortLeavesForCommitment.function.ts";

/**
 * The sibling hashes from a buyer's leaf up to the root, or null if no leaf has that public draw id. Rebuilds the
 * whole tree, so it suits the verifier; a server answers from stored levels with inclusionProofFromLevels.
 */
export const buildInclusionProof = async (
    leaves: readonly IWaitlistLeaf[],
    publicDrawId: Bytes32Hex,
): Promise<IMerkleProofStep[] | null> => {
    const sorted = sortLeavesForCommitment(leaves);
    const position = sorted.findIndex((leaf) => leaf.publicDrawId === publicDrawId);
    if (position < 0) return null;
    const tree = await buildMerkleTree(await Promise.all(sorted.map(hashWaitlistLeaf)));
    return inclusionProofFromLevels(tree.levels, position);
};
