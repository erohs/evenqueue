import { durationOfSeconds } from "#domain/shared/time/functions/durationOfSeconds.function.ts";

/** The named round must be at least this far after the commitment, to allow for clock skew and publishing delay. */
export const minimumBeaconLead = durationOfSeconds(600);
