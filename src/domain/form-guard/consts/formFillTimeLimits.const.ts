import { durationOfHours } from "#domain/shared/time/functions/durationOfHours.function.ts";
import { durationOfSeconds } from "#domain/shared/time/functions/durationOfSeconds.function.ts";

/**
 * A form sent within three seconds of being served is almost certainly a script; a person who is that quick is asked
 * to confirm, never turned away. A day is long enough to leave a tab open overnight.
 */
export const formFillTimeLimits = {
    shortest: durationOfSeconds(3),
    longest: durationOfHours(24),
} as const;
