import { isBytes32Hex } from "#domain/shared/bytes/functions/isBytes32Hex.function.ts";
import { isCount } from "#domain/shared/counting/functions/isCount.function.ts";
import { parsedFields } from "#domain/shared/parsing/functions/parsedFields.function.ts";
import type { ParseResult } from "#domain/shared/parsing/types/ParseResult.type.ts";
import { isEpochMilliseconds } from "#domain/shared/time/functions/isEpochMilliseconds.function.ts";
import type { IPublicLogEntry } from "../interfaces/IPublicLogEntry.ts";
import { isCanonicalJsonValue } from "./isCanonicalJsonValue.function.ts";
import { isPublicLogEntryType } from "./isPublicLogEntryType.function.ts";

export const parsePublicLogEntry = (value: unknown): ParseResult<IPublicLogEntry> =>
    parsedFields<IPublicLogEntry>(value, {
        sequenceNumber: isCount,
        recordedAt: isEpochMilliseconds,
        entryType: isPublicLogEntryType,
        body: isCanonicalJsonValue,
        previousHash: isBytes32Hex,
        entryHash: isBytes32Hex,
    });
