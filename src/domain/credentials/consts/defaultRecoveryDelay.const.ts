import { durationOfHours } from "#domain/shared/time/functions/durationOfHours.function.ts";
import { toRecoveryDelay } from "../functions/toRecoveryDelay.function.ts";

export const defaultRecoveryDelay = toRecoveryDelay(durationOfHours(12));
