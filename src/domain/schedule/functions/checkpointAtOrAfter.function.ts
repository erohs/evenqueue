import { addDuration } from "#domain/shared/time/functions/addDuration.function.ts";
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
): EpochMilliseconds =>
    time <= drawAt ? drawAt : addDuration(drawAt, interval, Math.ceil((time - drawAt) / interval));
