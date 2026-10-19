import { millisecondsPerHour } from "#domain/shared/time/consts/millisecondsPerHour.const.ts";
import type { DurationMilliseconds } from "#domain/shared/time/types/DurationMilliseconds.type.ts";

export const defaultRecoveryDelay: DurationMilliseconds = 12 * millisecondsPerHour;
