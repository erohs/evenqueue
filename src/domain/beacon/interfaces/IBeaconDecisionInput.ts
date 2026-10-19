import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";
import type { IBeaconReadingSummary } from "./IBeaconReadingSummary.ts";

export interface IBeaconDecisionInput {
    readonly now: EpochMilliseconds;
    readonly committedRound: number;
    readonly readingSummary: IBeaconReadingSummary;
    readonly voidsSoFar: number;
    /** Distinct parties independent of the vendor. */
    readonly independentHaltAttestations: number;
}
