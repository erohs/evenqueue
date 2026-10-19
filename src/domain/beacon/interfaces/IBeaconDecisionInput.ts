import type { Count } from "#domain/shared/counting/types/Count.type.ts";
import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";
import type { BeaconRound } from "../types/BeaconRound.type.ts";
import type { IBeaconReadingSummary } from "./IBeaconReadingSummary.ts";

export interface IBeaconDecisionInput {
    readonly now: EpochMilliseconds;
    readonly committedRound: BeaconRound;
    readonly readingSummary: IBeaconReadingSummary;
    readonly voidsSoFar: Count;
    /** Distinct parties independent of the vendor. */
    readonly independentHaltAttestations: Count;
}
