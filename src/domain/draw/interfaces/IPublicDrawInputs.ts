import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";

/**
 * The two public values that fix the order of a draw. The waitlist root is committed before the beacon round exists,
 * and nobody controls the beacon, so neither the vendor nor a buyer can steer the order, and anyone can recompute it.
 */
export interface IPublicDrawInputs {
    /** From the named public beacon round. */
    readonly beaconRandomness: Bytes32Hex;
    /** Published before the beacon round. */
    readonly committedWaitlistRoot: Bytes32Hex;
}
