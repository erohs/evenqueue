import { toEpochMilliseconds } from "#domain/shared/time/functions/toEpochMilliseconds.function.ts";
import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";
import type { ISettableClock } from "../interfaces/ISettableClock.ts";

export const createSettableClock = (startsAt: EpochMilliseconds): ISettableClock => {
    let now = startsAt;
    return {
        now: () => now,
        advanceBy: (milliseconds) => {
            now = toEpochMilliseconds(now + milliseconds);
        },
    };
};
