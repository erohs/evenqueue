import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";

/**
 * One buyer's place on a vendor's waitlist: a random place id and four counters. No name, no contact detail and no
 * timestamp, so the waitlist cannot identify anyone.
 */
export interface IWaitlistPlace {
    readonly placeId: Bytes32Hex;
    readonly drawsEntered: number;
    /** Whether or not the buyer took them up. */
    readonly offersReceived: number;
    /** The window the place joined in, or was moved back to. Counted from 0. */
    readonly entryWindowNumber: number;
    /** Since the place joined or was last moved to the back. */
    readonly offersNotTakenSinceLastMove: number;
}
