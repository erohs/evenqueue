import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import type { IPublishedRecovery } from "../interfaces/IPublishedRecovery.ts";

/**
 * The id a code's place was committed under, following any recoveries since the commitment back to the original, or
 * "replaced" when a recovery has since replaced this code. A chain of recoveries is followed at most once per entry,
 * so a cycle in hostile data cannot loop forever.
 */
export const committedPublicDrawIdThroughRecoveries = (
    ownPublicDrawId: Bytes32Hex,
    recoveriesSinceCommit: readonly IPublishedRecovery[],
): Bytes32Hex | "replaced" => {
    if (recoveriesSinceCommit.some((recovery) => recovery.replacedPublicDrawId === ownPublicDrawId)) return "replaced";
    let publicDrawId = ownPublicDrawId;
    for (let step = 0; step < recoveriesSinceCommit.length; step++) {
        const recovery = recoveriesSinceCommit.find((candidate) => candidate.replacementPublicDrawId === publicDrawId);
        if (recovery === undefined) break;
        publicDrawId = recovery.replacedPublicDrawId;
    }
    return publicDrawId;
};
