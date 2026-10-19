import type { ParseResult } from "#domain/shared/parsing/types/ParseResult.type.ts";
import type { IDrop } from "../interfaces/IDrop.ts";
import { parseDropSettings } from "./parseDropSettings.function.ts";
import { parseSettingsNotice } from "./parseSettingsNotice.function.ts";

type SettingsWithNotice = Pick<IDrop, "settings" | "settingsNotice">;

/** A stored drop's settings and pending notice. The notice must be given, as null if there is none. */
export const parseSettingsWithNotice = (stored: Readonly<Record<string, unknown>>): ParseResult<SettingsWithNotice> => {
    const settings = parseDropSettings(stored["settings"]);
    if (!settings.isValid) {
        return { isValid: false, problems: settings.problems.map((problem) => `settings: ${problem}`) };
    }
    if (stored["settingsNotice"] === null) {
        return { isValid: true, value: { settings: settings.value, settingsNotice: null } };
    }
    const notice = parseSettingsNotice(stored["settingsNotice"], settings.value);
    if (!notice.isValid) {
        return { isValid: false, problems: notice.problems.map((problem) => `settingsNotice: ${problem}`) };
    }
    return { isValid: true, value: { settings: settings.value, settingsNotice: notice.value } };
};
