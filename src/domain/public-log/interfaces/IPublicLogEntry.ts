import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import type { Count } from "#domain/shared/counting/types/Count.type.ts";
import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";
import type { JsonValue } from "../types/JsonValue.type.ts";
import type { PublicLogEntryType } from "../types/PublicLogEntryType.type.ts";

export interface IPublicLogEntry {
    /** Counted from 0. */
    readonly sequenceNumber: Count;
    readonly recordedAt: EpochMilliseconds;
    readonly entryType: PublicLogEntryType;
    readonly body: JsonValue;
    /** The hash of the entry before, or 64 zeros for the first. */
    readonly previousHash: Bytes32Hex;
    readonly entryHash: Bytes32Hex;
}
