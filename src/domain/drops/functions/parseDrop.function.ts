import { isBytes32Hex } from "#domain/shared/bytes/functions/isBytes32Hex.function.ts";
import { isCount } from "#domain/shared/counting/functions/isCount.function.ts";
import { isRecord } from "#domain/shared/parsing/functions/isRecord.function.ts";
import { parsedFields } from "#domain/shared/parsing/functions/parsedFields.function.ts";
import type { ParseResult } from "#domain/shared/parsing/types/ParseResult.type.ts";
import { isEpochMilliseconds } from "#domain/shared/time/functions/isEpochMilliseconds.function.ts";
import type { IDrop } from "../interfaces/IDrop.ts";
import { isDropState } from "./isDropState.function.ts";
import { parseSettingsWithNotice } from "./parseSettingsWithNotice.function.ts";

type DropFields = Omit<IDrop, "settings" | "settingsNotice">;

const dropFieldGuards = {
    dropId: isBytes32Hex,
    waitlistId: isBytes32Hex,
    entryWindowNumber: isCount,
    state: isDropState,
    openedAt: (field: unknown) => field === null || isEpochMilliseconds(field),
};

const openingProblems = (drop: DropFields): string[] => {
    if (drop.state === "draft") return drop.openedAt === null ? [] : ["a draft has an opening time"];
    return drop.openedAt === null && drop.state !== "cancelled" ? ["an opened drop has no opening time"] : [];
};

/** A drop read back from storage. */
export const parseDrop = (value: unknown): ParseResult<IDrop> => {
    if (!isRecord(value)) return { isValid: false, problems: ["not an object"] };
    const fields = parsedFields<DropFields>(value, dropFieldGuards, openingProblems);
    if (!fields.isValid) return fields;
    const settings = parseSettingsWithNotice(value);
    if (!settings.isValid) return settings;
    if (fields.value.state === "draft" && settings.value.settingsNotice !== null) {
        return { isValid: false, problems: ["a draft has a notice"] };
    }
    return { isValid: true, value: { ...fields.value, ...settings.value } };
};
