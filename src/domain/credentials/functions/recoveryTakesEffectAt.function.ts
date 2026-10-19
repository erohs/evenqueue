import { addDuration } from "#domain/shared/time/functions/addDuration.function.ts";
import { latestOf } from "#domain/shared/time/functions/latestOf.function.ts";
import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";
import type { RecoveryDelay } from "../types/RecoveryDelay.type.ts";

/**
 * The later of the delay ending and the next checkpoint, so the old code's holder always has the whole delay to
 * cancel, and a swap never lands before the coming checkpoint. Pass null for the checkpoint when no drop is scheduled.
 */
export const recoveryTakesEffectAt = (
    requestedAt: EpochMilliseconds,
    delay: RecoveryDelay,
    nextCheckpointAt: EpochMilliseconds | null,
): EpochMilliseconds => {
    const delayEnds = addDuration(requestedAt, delay);
    return nextCheckpointAt === null ? delayEnds : latestOf(delayEnds, nextCheckpointAt);
};
