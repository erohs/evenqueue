import type { DurationMilliseconds } from "#domain/shared/time/types/DurationMilliseconds.type.ts";
import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";
import { minimumRecoveryDelay } from "../consts/minimumRecoveryDelay.const.ts";

/**
 * The later of the delay ending and the next checkpoint, so a recovered code never acts between checkpoints and the
 * old code's holder always has the whole delay to cancel. Pass null for the checkpoint when no drop is scheduled.
 */
export const recoveryTakesEffectAt = (
    requestedAt: EpochMilliseconds,
    delay: DurationMilliseconds,
    nextCheckpointAt: EpochMilliseconds | null,
): EpochMilliseconds => {
    if (!(delay >= minimumRecoveryDelay)) throw new RangeError("the recovery delay must be at least six hours");
    return Math.max(requestedAt + delay, nextCheckpointAt ?? Number.NEGATIVE_INFINITY);
};
