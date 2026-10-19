import { isRecord } from "#domain/shared/parsing/functions/isRecord.function.ts";
import { parsedFields } from "#domain/shared/parsing/functions/parsedFields.function.ts";
import type { ParseResult } from "#domain/shared/parsing/types/ParseResult.type.ts";
import { isEpochMilliseconds } from "#domain/shared/time/functions/isEpochMilliseconds.function.ts";
import { dropSettingChangeClasses } from "../consts/dropSettingChangeClasses.const.ts";
import type { IDropSettings } from "../interfaces/IDropSettings.ts";
import type { ISettingsNotice } from "../interfaces/ISettingsNotice.ts";
import type { DropSettingName } from "../types/DropSettingName.type.ts";
import { parseDropSettings } from "./parseDropSettings.function.ts";
import { settingsPicked } from "./settingsPicked.function.ts";

const isNoticedSettingName = (name: string): boolean =>
    Object.hasOwn(dropSettingChangeClasses, name) &&
    dropSettingChangeClasses[name as DropSettingName] === "after-notice";

/** A notice read back from storage. Its changes must be after-notice settings that are valid on top of `settings`. */
export const parseSettingsNotice = (value: unknown, settings: IDropSettings): ParseResult<ISettingsNotice> => {
    if (!isRecord(value) || !isRecord(value["changes"])) return { isValid: false, problems: ["changes are missing"] };
    const names = Object.keys(value["changes"]);
    if (names.length === 0 || !names.every(isNoticedSettingName)) {
        return { isValid: false, problems: ["changes must name after-notice settings only"] };
    }
    const changed = parseDropSettings({ ...settings, ...value["changes"] });
    if (!changed.isValid) return { isValid: false, problems: changed.problems.map((problem) => `changes: ${problem}`) };
    const times = parsedFields<Omit<ISettingsNotice, "changes">>(
        value,
        { givenAt: isEpochMilliseconds, takesEffectAt: isEpochMilliseconds },
        (notice) => (notice.takesEffectAt > notice.givenAt ? [] : ["takes effect before it is given"]),
    );
    if (!times.isValid) return times;
    return {
        isValid: true,
        value: { ...times.value, changes: settingsPicked(changed.value, names as DropSettingName[]) },
    };
};
