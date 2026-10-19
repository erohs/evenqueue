import type { IDrop } from "../interfaces/IDrop.ts";
import type { IDropSettings } from "../interfaces/IDropSettings.ts";
import type { ISettingsNotice } from "../interfaces/ISettingsNotice.ts";
import type { DropSettingName } from "../types/DropSettingName.type.ts";
import { settingsPicked } from "./settingsPicked.function.ts";

/** Changed settings not named in the notice apply at once. */
export const dropAfterSettingsChange = (
    drop: IDrop,
    proposed: IDropSettings,
    changed: readonly DropSettingName[],
    notice: ISettingsNotice,
): IDrop => {
    const noticed = Object.keys(notice.changes);
    const immediate = changed.filter((name) => !noticed.includes(name));
    return {
        ...drop,
        settings: { ...drop.settings, ...settingsPicked(proposed, immediate) },
        settingsNotice: noticed.length > 0 ? notice : drop.settingsNotice,
    };
};
