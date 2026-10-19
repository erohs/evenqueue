import { durationOfHours } from "#domain/shared/time/functions/durationOfHours.function.ts";

/**
 * The named round is this long after the commitment, so a public timestamp of the root can land before the round
 * exists and prove the order was fixed in time.
 */
export const defaultAnchorHorizon = durationOfHours(6);
