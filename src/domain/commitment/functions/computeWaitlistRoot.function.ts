import { encodeHex } from "#domain/shared/bytes/functions/encodeHex.function.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import type { IWaitlistLeaf } from "../interfaces/IWaitlistLeaf.ts";
import { buildMerkleLevels } from "./buildMerkleLevels.function.ts";
import { hashWaitlistLeaf } from "./hashWaitlistLeaf.function.ts";
import { sortLeavesForCommitment } from "./sortLeavesForCommitment.function.ts";

/** The same leaves give the same root in any order. */
export const computeWaitlistRoot = async (leaves: readonly IWaitlistLeaf[]): Promise<Bytes32Hex> => {
    const leafHashes = await Promise.all(sortLeavesForCommitment(leaves).map(hashWaitlistLeaf));
    const levels = await buildMerkleLevels(leafHashes);
    return encodeHex(levels.at(-1)?.[0] ?? new Uint8Array());
};
