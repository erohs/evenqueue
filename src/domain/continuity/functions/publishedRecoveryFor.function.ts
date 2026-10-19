import { computePublicDrawId } from "#domain/commitment/functions/computePublicDrawId.function.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import type { IPublishedRecovery } from "../interfaces/IPublishedRecovery.ts";

/** What to publish when a recovery takes effect, for the latest committed draw. */
export const publishedRecoveryFor = async (
    replacedPlaceTag: Bytes32Hex,
    replacementPlaceTag: Bytes32Hex,
    latestCommittedDrawId: Bytes32Hex,
): Promise<IPublishedRecovery> => ({
    replacedPublicDrawId: await computePublicDrawId(replacedPlaceTag, latestCommittedDrawId),
    replacementPublicDrawId: await computePublicDrawId(replacementPlaceTag, latestCommittedDrawId),
});
