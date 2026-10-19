import { durationOfHours } from "#domain/shared/time/functions/durationOfHours.function.ts";

/** How long a published notice runs before an after-notice setting changes, so buyers see it coming. */
export const settingsChangeNotice = durationOfHours(24);
