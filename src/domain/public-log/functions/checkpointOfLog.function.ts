import { toCount } from "#domain/shared/counting/functions/toCount.function.ts";
import type { Count } from "#domain/shared/counting/types/Count.type.ts";
import { firstEntryPreviousHash } from "../consts/firstEntryPreviousHash.const.ts";
import type { ILogCheckpoint } from "../interfaces/ILogCheckpoint.ts";
import type { IPublicLogEntry } from "../interfaces/IPublicLogEntry.ts";

/** The checkpoint after the first `entryCount` entries; the whole log by default. */
export const checkpointOfLog = (
    entries: readonly IPublicLogEntry[],
    entryCount: Count = toCount(entries.length),
): ILogCheckpoint => {
    if (entryCount > entries.length) throw new RangeError("the log is shorter than the checkpoint asked for");
    return { entryCount, headHash: entries[entryCount - 1]?.entryHash ?? firstEntryPreviousHash };
};
