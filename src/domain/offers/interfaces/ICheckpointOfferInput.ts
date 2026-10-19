import type { IServiceGap } from "#domain/schedule/interfaces/IServiceGap.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import type { DurationMilliseconds } from "#domain/shared/time/types/DurationMilliseconds.type.ts";
import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";
import type { IUnitAwaitingOffer } from "./IUnitAwaitingOffer.ts";

export interface ICheckpointOfferInput {
    readonly unitsAwaitingOffer: readonly IUnitAwaitingOffer[];
    /** The committed order of the draw, best first. */
    readonly placeIdsInDrawOrder: readonly Bytes32Hex[];
    /** Places already offered a unit in this drop; nobody is offered twice. */
    readonly placeIdsAlreadyOffered: ReadonlySet<Bytes32Hex>;
    readonly checkpointAt: EpochMilliseconds;
    readonly offerWindow: DurationMilliseconds;
    readonly serviceGaps: readonly IServiceGap[];
    /** How many more times a unit is offered after its first offer lapses. */
    readonly backfillOffersPerUnit: number;
}
