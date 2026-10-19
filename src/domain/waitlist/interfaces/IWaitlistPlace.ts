import type { Count } from "#domain/shared/counting/types/Count.type.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";

/**
 * One buyer's place on a vendor's waitlist: a random place id and four counters. No name, no contact detail and no
 * timestamp, so the waitlist cannot identify anyone. Made by createWaitlistPlace, the allocation rules or
 * parseWaitlistPlace, so offers received never exceed draws entered.
 */
export interface IWaitlistPlace {
    readonly placeId: Bytes32Hex;
    readonly drawsEntered: Count;
    /** Whether or not the buyer took them up. */
    readonly offersReceived: Count;
    /** The window the place joined in, or was moved back to. Counted from 0. */
    readonly entryWindowNumber: Count;
    /** Unclaimed offers in a row since the place joined, moved to the back of the line or had its priority reset. */
    readonly offersNotTakenSinceLastMove: Count;
}
