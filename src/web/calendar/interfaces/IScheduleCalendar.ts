import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";

export interface IScheduleCalendar {
    readonly dropId: Bytes32Hex;
    /** The neutral label only, so a calendar shared with others names neither the vendor nor the product. */
    readonly waitlistLabel: string;
    readonly entryClosesAt: EpochMilliseconds | null;
    readonly writtenAt: EpochMilliseconds;
}
