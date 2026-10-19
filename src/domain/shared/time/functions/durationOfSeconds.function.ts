import { millisecondsPerSecond } from "../consts/millisecondsPerSecond.const.ts";
import type { DurationMilliseconds } from "../types/DurationMilliseconds.type.ts";
import { toDurationMilliseconds } from "./toDurationMilliseconds.function.ts";

export const durationOfSeconds = (seconds: number): DurationMilliseconds =>
    toDurationMilliseconds(seconds * millisecondsPerSecond);
