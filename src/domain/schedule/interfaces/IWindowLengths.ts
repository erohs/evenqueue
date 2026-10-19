import type { DurationMilliseconds } from "#domain/shared/time/types/DurationMilliseconds.type.ts";

export interface IWindowLengths {
    /** Uptime during which new buyers can join before the draw. */
    readonly entryWindow: DurationMilliseconds;
    /** Uptime a buyer has to claim an offer. */
    readonly offerWindow: DurationMilliseconds;
    /** Offers go out at the draw and then at every checkpoint. */
    readonly checkpointInterval: DurationMilliseconds;
}
