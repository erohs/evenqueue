import type { IClock } from "#application/ports/interfaces/IClock.ts";
import { toEpochMilliseconds } from "#domain/shared/time/functions/toEpochMilliseconds.function.ts";

export const createSystemClock = (): IClock => ({ now: () => toEpochMilliseconds(Date.now()) });
