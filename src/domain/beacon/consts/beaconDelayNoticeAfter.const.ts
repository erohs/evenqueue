import { durationOfHours } from "#domain/shared/time/functions/durationOfHours.function.ts";

/** Past the round's time by this much, a public delay notice goes out; the draw keeps waiting. */
export const beaconDelayNoticeAfter = durationOfHours(1);
