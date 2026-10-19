import type { DurationMilliseconds } from "../types/DurationMilliseconds.type.ts";
import type { EpochMilliseconds } from "../types/EpochMilliseconds.type.ts";
import { toEpochMilliseconds } from "./toEpochMilliseconds.function.ts";

/** `time` plus `times` lots of `duration`. Durations are at most a century, so the sum stays exact. */
export const addDuration = (time: EpochMilliseconds, duration: DurationMilliseconds, times = 1): EpochMilliseconds =>
    toEpochMilliseconds(time + duration * times);
