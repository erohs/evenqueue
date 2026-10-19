import { durationOfHours } from "#domain/shared/time/functions/durationOfHours.function.ts";

/** Long enough for the owner of the old code to see "recovery requested" and cancel it. */
export const minimumRecoveryDelay = durationOfHours(6);
