import { isRecord } from "#domain/shared/parsing/functions/isRecord.function.ts";
import type { ParseResult } from "#domain/shared/parsing/types/ParseResult.type.ts";
import type { IPlaceCredentials } from "../interfaces/IPlaceCredentials.ts";
import { parsePendingRecovery } from "./parsePendingRecovery.function.ts";
import { parseStoredCredentials } from "./parseStoredCredentials.function.ts";

/** A place's credentials read back from storage or a backup. A pending recovery must be given, as null if there is none. */
export const parsePlaceCredentials = (value: unknown): ParseResult<IPlaceCredentials> => {
    if (!isRecord(value)) return { isValid: false, problems: ["not an object"] };
    const current = parseStoredCredentials(value["current"]);
    const pending = value["pendingRecovery"] === null ? null : parsePendingRecovery(value["pendingRecovery"]);
    const problems = [
        ...(current.isValid ? [] : current.problems.map((problem) => `current: ${problem}`)),
        ...(pending === null || pending.isValid
            ? []
            : pending.problems.map((problem) => `pendingRecovery: ${problem}`)),
    ];
    if (!current.isValid || (pending !== null && !pending.isValid)) return { isValid: false, problems };
    return {
        isValid: true,
        value: { current: current.value, pendingRecovery: pending === null ? null : pending.value },
    };
};
