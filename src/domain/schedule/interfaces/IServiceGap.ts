import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";

/** A stretch when the service was down, found from missed heartbeats. Windows are extended by it. */
export interface IServiceGap {
    readonly startsAt: EpochMilliseconds;
    readonly endsAt: EpochMilliseconds;
}
