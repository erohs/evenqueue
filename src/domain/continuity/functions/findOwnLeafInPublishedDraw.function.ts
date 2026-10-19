import type { IWaitlistLeaf } from "#domain/commitment/interfaces/IWaitlistLeaf.ts";
import type { ByteArray } from "#domain/shared/bytes/types/ByteArray.type.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import type { IPublishedRecovery } from "../interfaces/IPublishedRecovery.ts";
import { committedPublicDrawIdThroughRecoveries } from "./committedPublicDrawIdThroughRecoveries.function.ts";
import { publicDrawIdOfEntryCode } from "./publicDrawIdOfEntryCode.function.ts";

/**
 * A buyer's own leaf in a published draw, found from their entry code and the recoveries published since, or
 * "replaced" when a recovery has replaced this code, or null if the code was not in the draw.
 */
export const findOwnLeafInPublishedDraw = async (
    entrySecret: ByteArray,
    drawId: Bytes32Hex,
    publishedLeaves: readonly IWaitlistLeaf[],
    recoveriesSinceCommit: readonly IPublishedRecovery[] = [],
): Promise<IWaitlistLeaf | "replaced" | null> => {
    const ownPublicDrawId = await publicDrawIdOfEntryCode(entrySecret, drawId);
    const committedId = committedPublicDrawIdThroughRecoveries(ownPublicDrawId, recoveriesSinceCommit);
    if (committedId === "replaced") return "replaced";
    return publishedLeaves.find((leaf) => leaf.publicDrawId === committedId) ?? null;
};
