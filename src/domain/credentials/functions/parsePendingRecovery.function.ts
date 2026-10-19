import { isRecord } from "#domain/shared/parsing/functions/isRecord.function.ts";
import { parsedFields } from "#domain/shared/parsing/functions/parsedFields.function.ts";
import type { ParseResult } from "#domain/shared/parsing/types/ParseResult.type.ts";
import { isEpochMilliseconds } from "#domain/shared/time/functions/isEpochMilliseconds.function.ts";
import type { IPendingRecovery } from "../interfaces/IPendingRecovery.ts";
import { parseStoredCredentials } from "./parseStoredCredentials.function.ts";

export const parsePendingRecovery = (value: unknown): ParseResult<IPendingRecovery> => {
    if (!isRecord(value)) return { isValid: false, problems: ["not an object"] };
    const replacement = parseStoredCredentials(value["replacement"]);
    if (!replacement.isValid) {
        return { isValid: false, problems: replacement.problems.map((problem) => `replacement: ${problem}`) };
    }
    const times = parsedFields<Omit<IPendingRecovery, "replacement">>(
        value,
        { requestedAt: isEpochMilliseconds, takesEffectAt: isEpochMilliseconds },
        (recovery) => (recovery.takesEffectAt > recovery.requestedAt ? [] : ["takes effect before it is asked for"]),
    );
    return times.isValid ? { isValid: true, value: { ...times.value, replacement: replacement.value } } : times;
};
