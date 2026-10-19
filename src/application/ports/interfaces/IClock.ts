import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";

export interface IClock {
    now: () => EpochMilliseconds;
}
