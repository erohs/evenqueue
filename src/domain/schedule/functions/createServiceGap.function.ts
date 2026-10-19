import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";
import type { IServiceGap } from "../interfaces/IServiceGap.ts";

export const createServiceGap = (startsAt: EpochMilliseconds, endsAt: EpochMilliseconds): IServiceGap => {
    if (endsAt <= startsAt) throw new RangeError("a service gap must end after it starts");
    return { startsAt, endsAt };
};
