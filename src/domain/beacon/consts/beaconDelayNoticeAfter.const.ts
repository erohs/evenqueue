import { millisecondsPerHour } from "#domain/shared/time/consts/millisecondsPerHour.const.ts";
import type { DurationMilliseconds } from "#domain/shared/time/types/DurationMilliseconds.type.ts";

/** Past the round's time by this much, a public delay notice goes out; the draw keeps waiting. */
export const beaconDelayNoticeAfter: DurationMilliseconds = millisecondsPerHour;
