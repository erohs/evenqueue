import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";

export interface IOffer {
    readonly unitNumber: number;
    readonly placeId: Bytes32Hex;
    readonly offeredAt: EpochMilliseconds;
    /** Extended by outages, like every window. */
    readonly expiresAt: EpochMilliseconds;
    /** 1 for the unit's first offer; higher numbers are backfill offers after earlier ones lapsed. */
    readonly offerRound: number;
}
