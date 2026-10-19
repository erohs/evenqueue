import { millisecondsPerHour } from "#domain/shared/time/consts/millisecondsPerHour.const.ts";
import type { DurationMilliseconds } from "#domain/shared/time/types/DurationMilliseconds.type.ts";

/**
 * The named round is this long after the commitment, so a public timestamp of the root can land before the round
 * exists and prove the order was fixed in time.
 */
export const defaultAnchorHorizon: DurationMilliseconds = 6 * millisecondsPerHour;
