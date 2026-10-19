import { assertPositiveWholeNumber } from "#domain/shared/validation/functions/assertPositiveWholeNumber.function.ts";
import type { DurationMilliseconds } from "#domain/shared/time/types/DurationMilliseconds.type.ts";
import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";

/**
 * Checkpoints fall at the draw and then every `interval`. Returns the first one at or after `time`: when a unit freed
 * at `time` is next offered.
 */
export const checkpointAtOrAfter = (
    drawAt: EpochMilliseconds,
    interval: DurationMilliseconds,
    time: EpochMilliseconds,
): EpochMilliseconds => {
    assertPositiveWholeNumber(interval, "checkpoint interval");
    if (time <= drawAt) return drawAt;
    return drawAt + Math.ceil((time - drawAt) / interval) * interval;
};
