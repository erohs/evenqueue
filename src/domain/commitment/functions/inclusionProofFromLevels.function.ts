import { hexOfDigest } from "#domain/shared/bytes/functions/hexOfDigest.function.ts";
import type { ByteArray } from "#domain/shared/bytes/types/ByteArray.type.ts";
import type { IMerkleProofStep } from "../interfaces/IMerkleProofStep.ts";

/** One sibling per level, read from the levels stored at close: no hashing, so it fits a buyer's request. */
export const inclusionProofFromLevels = (
    levels: readonly (readonly ByteArray[])[],
    leafPosition: number,
): IMerkleProofStep[] =>
    levels.slice(0, -1).flatMap((level, height) => {
        const position = Math.floor(leafPosition / 2 ** height);
        const siblingPosition = position % 2 === 0 ? position + 1 : position - 1;
        const sibling = level[siblingPosition];
        return sibling === undefined
            ? []
            : [{ siblingHash: hexOfDigest(sibling), isSiblingOnLeft: siblingPosition < position }];
    });
