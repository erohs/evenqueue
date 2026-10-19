import { sha256Hex } from "#domain/shared/bytes/functions/sha256Hex.function.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import { publicLogEntryTag } from "../consts/publicLogEntryTag.const.ts";
import type { UnhashedLogEntry } from "../types/UnhashedLogEntry.type.ts";
import { canonicalJson } from "./canonicalJson.function.ts";

/**
 * SHA-256(tag ‖ canonical JSON of the five fields). The previous hash is one of them, so changing, removing or
 * inserting any entry changes the hash of every entry after it.
 */
export const computeLogEntryHash = (entry: UnhashedLogEntry): Promise<Bytes32Hex> => {
    const { sequenceNumber, recordedAt, entryType, body, previousHash } = entry;
    const text = canonicalJson({ sequenceNumber, recordedAt, entryType, body, previousHash });
    return sha256Hex(publicLogEntryTag, new TextEncoder().encode(text));
};
