import type { IServiceGap } from "#domain/schedule/interfaces/IServiceGap.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import type { Count } from "#domain/shared/counting/types/Count.type.ts";
import type { DurationMilliseconds } from "#domain/shared/time/types/DurationMilliseconds.type.ts";
import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";

/** Sets and maps rather than lists, so no unit and no place can be listed twice. */
export interface ICheckpointOfferInput {
    /** Each free unit, by number, with how many times it has already been offered in this drop. */
    readonly offersMadeByUnitNumber: ReadonlyMap<Count, Count>;
    /** The committed order of the draw, best first. */
    readonly placeIdsInDrawOrder: ReadonlySet<Bytes32Hex>;
    /** Places already offered a unit in this drop; nobody is offered twice. */
    readonly placeIdsAlreadyOffered: ReadonlySet<Bytes32Hex>;
    readonly checkpointAt: EpochMilliseconds;
    readonly offerWindow: DurationMilliseconds;
    readonly serviceGaps: readonly IServiceGap[];
    /** How many more times a unit is offered after its first offer lapses. */
    readonly backfillOffersPerUnit: Count;
}
