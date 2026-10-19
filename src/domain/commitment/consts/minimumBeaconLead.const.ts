import { millisecondsPerSecond } from "#domain/shared/time/consts/millisecondsPerSecond.const.ts";
import type { DurationMilliseconds } from "#domain/shared/time/types/DurationMilliseconds.type.ts";

/** The named round must be at least this far after the commitment, to allow for clock skew and publishing delay. */
export const minimumBeaconLead: DurationMilliseconds = 10 * 60 * millisecondsPerSecond;
