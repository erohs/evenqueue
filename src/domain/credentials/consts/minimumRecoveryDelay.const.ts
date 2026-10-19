import { millisecondsPerHour } from "#domain/shared/time/consts/millisecondsPerHour.const.ts";
import type { DurationMilliseconds } from "#domain/shared/time/types/DurationMilliseconds.type.ts";

/** Long enough for the owner of the old code to see "recovery requested" and cancel it. */
export const minimumRecoveryDelay: DurationMilliseconds = 6 * millisecondsPerHour;
