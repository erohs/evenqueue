import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import type { IWaitlistLeaf } from "../interfaces/IWaitlistLeaf.ts";
import { buildMerkleTree } from "./buildMerkleTree.function.ts";
import { hashWaitlistLeaf } from "./hashWaitlistLeaf.function.ts";
import { sortLeavesForCommitment } from "./sortLeavesForCommitment.function.ts";

/** The same leaves give the same root in any order. */
export const computeWaitlistRoot = async (leaves: readonly IWaitlistLeaf[]): Promise<Bytes32Hex> =>
    (await buildMerkleTree(await Promise.all(sortLeavesForCommitment(leaves).map(hashWaitlistLeaf)))).root;
