import { beaconRoundTime } from "#domain/beacon/functions/beaconRoundTime.function.ts";
import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";
import type { ICommitment } from "../interfaces/ICommitment.ts";

/**
 * True only when a public timestamp attests the root before the named round existed. Otherwise the draw is shown as
 * "timing unproven": the vendor could have committed after seeing the randomness.
 */
export const isCommitmentTimingProven = (
    commitment: ICommitment,
    rootTimestampedAt: EpochMilliseconds | null,
): boolean => rootTimestampedAt !== null && rootTimestampedAt < beaconRoundTime(commitment.beaconRound);
