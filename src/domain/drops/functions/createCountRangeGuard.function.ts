import { isCount } from "#domain/shared/counting/functions/isCount.function.ts";
import type { Count } from "#domain/shared/counting/types/Count.type.ts";

export const createCountRangeGuard =
    (least: number, most: number): ((value: unknown) => value is Count) =>
    (value): value is Count =>
        isCount(value) && value >= least && value <= most;
