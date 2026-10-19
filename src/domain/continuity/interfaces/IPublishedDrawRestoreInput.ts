import type { IAllocationRule } from "#domain/allocation-rules/interfaces/IAllocationRule.ts";
import type { IWaitlistLeaf } from "#domain/commitment/interfaces/IWaitlistLeaf.ts";
import type { ByteArray } from "#domain/shared/bytes/types/ByteArray.type.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import type { IPublishedRecovery } from "./IPublishedRecovery.ts";

/** Everything needed comes from the public log and the buyer's entry code: no part of the lost database. */
export interface IPublishedDrawRestoreInput {
    readonly entrySecret: ByteArray;
    /** The latest committed draw. */
    readonly drawId: Bytes32Hex;
    readonly publishedLeaves: readonly IWaitlistLeaf[];
    /** The bodies of the `recovery` log entries made since that draw was committed. */
    readonly recoveriesSinceCommit: readonly IPublishedRecovery[];
    /** Whether offers went out in that draw; if not, nobody has missed out on it yet. */
    readonly hasDrawRun: boolean;
    /** The published draw order up to the last offer made, so places that may have bought are held back. */
    readonly offeredPublicDrawIds: ReadonlySet<Bytes32Hex>;
    /** The rule the draw was committed under, with the settings in its settings digest. */
    readonly rule: IAllocationRule;
    /** A fresh random id for the place on the new deployment. */
    readonly newPlaceId: Bytes32Hex;
}
