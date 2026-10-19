import { millisecondsPerSecond } from "#domain/shared/time/consts/millisecondsPerSecond.const.ts";
import type { DurationMilliseconds } from "#domain/shared/time/types/DurationMilliseconds.type.ts";

export const heartbeatInterval: DurationMilliseconds = 60 * millisecondsPerSecond;
