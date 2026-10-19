import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";

/** A stretch when the service was down. Made by createServiceGap or parseServiceGap, so it always ends after it starts. */
export interface IServiceGap {
    readonly startsAt: EpochMilliseconds;
    readonly endsAt: EpochMilliseconds;
}
