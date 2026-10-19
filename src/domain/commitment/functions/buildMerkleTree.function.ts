import { hexOfDigest } from "#domain/shared/bytes/functions/hexOfDigest.function.ts";
import { sha256Hex } from "#domain/shared/bytes/functions/sha256Hex.function.ts";
import { sha256OfConcatenatedParts } from "#domain/shared/bytes/functions/sha256OfConcatenatedParts.function.ts";
import type { ByteArray } from "#domain/shared/bytes/types/ByteArray.type.ts";
import { merkleHashPrefixes } from "../consts/merkleHashPrefixes.const.ts";
import type { IMerkleTree } from "../interfaces/IMerkleTree.ts";

const nextLevel = (level: readonly ByteArray[]): Promise<ByteArray[]> =>
    Promise.all(
        level
            .flatMap((left, i) => (i % 2 === 0 ? [{ left, right: level[i + 1] }] : []))
            .map(({ left, right }) =>
                right === undefined ? left : sha256OfConcatenatedParts(merkleHashPrefixes.node, left, right),
            ),
    );

/**
 * A node is SHA-256(0x01 ‖ left ‖ right); an odd last node moves up unchanged. The root of no leaves is SHA-256 of
 * nothing, as in RFC 6962, so every waitlist, even an empty one, has a root.
 */
export const buildMerkleTree = async (leafHashes: readonly ByteArray[]): Promise<IMerkleTree> => {
    const levels = [leafHashes];
    let level = leafHashes;
    while (level.length > 1) {
        level = await nextLevel(level);
        levels.push(level);
    }
    const [top] = level;
    return { levels, root: top === undefined ? await sha256Hex() : hexOfDigest(top) };
};
