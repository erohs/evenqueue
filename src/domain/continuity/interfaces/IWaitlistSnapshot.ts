import type { AllocationRuleId } from "#domain/allocation-rules/types/AllocationRuleId.type.ts";
import type { IPublicLogEntry } from "#domain/public-log/interfaces/IPublicLogEntry.ts";
import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";
import type { IPlaceRecord } from "./IPlaceRecord.ts";

/**
 * A portable copy of one waitlist, so a vendor can move host or domain, or rebuild after a takedown, without anyone
 * losing their place. It holds no codes and no keys: buyers' entry codes and view keys keep working on any
 * deployment, because their lookups are not keyed. Recovery codes need the old waitlist key, kept in a separate backup.
 */
export interface IWaitlistSnapshot {
    readonly formatVersion: number;
    readonly allocationRuleId: AllocationRuleId;
    readonly exportedAt: EpochMilliseconds;
    readonly places: readonly IPlaceRecord[];
    readonly publicLog: readonly IPublicLogEntry[];
}
