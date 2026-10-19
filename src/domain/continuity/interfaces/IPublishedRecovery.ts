import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";

/**
 * The body of a public `recovery` log entry: a place's id in the latest committed draw under its old codes and under
 * its new ones. It links the two for that one draw only, so a restore can follow the new code to the committed leaf
 * and refuse the old one.
 */
export interface IPublishedRecovery {
    readonly replacedPublicDrawId: Bytes32Hex;
    readonly replacementPublicDrawId: Bytes32Hex;
}
