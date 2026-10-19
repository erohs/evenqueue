import { zeroCount } from "#domain/shared/counting/consts/zeroCount.const.ts";
import { incrementCount } from "#domain/shared/counting/functions/incrementCount.function.ts";
import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";
import { firstEntryPreviousHash } from "../consts/firstEntryPreviousHash.const.ts";
import type { IPublicLogEntry } from "../interfaces/IPublicLogEntry.ts";
import type { JsonValue } from "../types/JsonValue.type.ts";
import type { PublicLogEntryType } from "../types/PublicLogEntryType.type.ts";
import { computeLogEntryHash } from "./computeLogEntryHash.function.ts";

/** The entry that follows `latest`, or the first entry when `latest` is null. Only the latest entry is needed. */
export const appendLogEntry = async (
    latest: IPublicLogEntry | null,
    entryType: PublicLogEntryType,
    body: JsonValue,
    recordedAt: EpochMilliseconds,
): Promise<IPublicLogEntry> => {
    if (latest !== null && recordedAt < latest.recordedAt) {
        throw new RangeError("a log entry cannot be recorded before the entry it follows");
    }
    const unhashed = {
        sequenceNumber: latest === null ? zeroCount : incrementCount(latest.sequenceNumber),
        recordedAt,
        entryType,
        body,
        previousHash: latest?.entryHash ?? firstEntryPreviousHash,
    };
    return { ...unhashed, entryHash: await computeLogEntryHash(unhashed) };
};
