import { isDurationMilliseconds } from "#domain/shared/time/functions/isDurationMilliseconds.function.ts";
import type { DurationMilliseconds } from "#domain/shared/time/types/DurationMilliseconds.type.ts";

export const createDurationRangeGuard =
    (least: DurationMilliseconds, most: DurationMilliseconds): ((value: unknown) => value is DurationMilliseconds) =>
    (value): value is DurationMilliseconds =>
        isDurationMilliseconds(value) && value >= least && value <= most;
