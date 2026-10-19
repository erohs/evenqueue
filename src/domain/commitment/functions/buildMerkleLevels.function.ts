import { sha256OfConcatenatedParts } from "#domain/shared/bytes/functions/sha256OfConcatenatedParts.function.ts";
import type { ByteArray } from "#domain/shared/bytes/types/ByteArray.type.ts";
import { merkleHashPrefixes } from "../consts/merkleHashPrefixes.const.ts";

/**
 * Every level from the leaf hashes up to the root. A node is SHA-256(0x01 ‖ left ‖ right); an odd last node moves up
 * unchanged.
 */
export const buildMerkleLevels = async (leafHashes: readonly ByteArray[]): Promise<ByteArray[][]> => {
    if (leafHashes.length === 0) throw new RangeError("a Merkle tree needs at least one leaf");
    const levels: ByteArray[][] = [[...leafHashes]];
    let current = levels[0] ?? [];
    while (current.length > 1) {
        const next: ByteArray[] = [];
        for (let i = 0; i < current.length; i += 2) {
            const left = current[i];
            const right = current[i + 1];
            if (left === undefined) break;
            next.push(
                right === undefined ? left : await sha256OfConcatenatedParts(merkleHashPrefixes.node, left, right),
            );
        }
        levels.push(next);
        current = next;
    }
    return levels;
};
