import { millisecondsPerHour } from "../consts/millisecondsPerHour.const.ts";
import type { DurationMilliseconds } from "../types/DurationMilliseconds.type.ts";
import { toDurationMilliseconds } from "./toDurationMilliseconds.function.ts";

export const durationOfHours = (hours: number): DurationMilliseconds =>
    toDurationMilliseconds(hours * millisecondsPerHour);
