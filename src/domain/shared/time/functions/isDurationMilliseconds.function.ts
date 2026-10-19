import { longestDuration } from "../consts/longestDuration.const.ts";
import type { DurationMilliseconds } from "../types/DurationMilliseconds.type.ts";

export const isDurationMilliseconds = (value: unknown): value is DurationMilliseconds =>
    Number.isSafeInteger(value) && (value as number) > 0 && (value as number) <= longestDuration;
