import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";

export interface IWindowClose {
    readonly closesAt: EpochMilliseconds;
    /** True when outages took more than the window could be stretched by: the vendor, not the buyer, ran out the clock. */
    readonly isCutShortByOutages: boolean;
}
