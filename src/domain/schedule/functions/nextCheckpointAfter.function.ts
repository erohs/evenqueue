import { addDuration } from "#domain/shared/time/functions/addDuration.function.ts";
import type { DurationMilliseconds } from "#domain/shared/time/types/DurationMilliseconds.type.ts";
import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";

/** The first checkpoint strictly after `now`: the time a status page tells a buyer to check back. */
export const nextCheckpointAfter = (
    drawAt: EpochMilliseconds,
    interval: DurationMilliseconds,
    now: EpochMilliseconds,
): EpochMilliseconds =>
    now < drawAt ? drawAt : addDuration(drawAt, interval, Math.floor((now - drawAt) / interval) + 1);
