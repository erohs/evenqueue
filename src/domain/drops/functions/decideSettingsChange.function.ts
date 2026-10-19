import { addDuration } from "#domain/shared/time/functions/addDuration.function.ts";
import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";
import { settingsChangeNotice } from "../consts/settingsChangeNotice.const.ts";
import type { IDrop } from "../interfaces/IDrop.ts";
import type { IDropSettings } from "../interfaces/IDropSettings.ts";
import type { SettingsChangeDecision } from "../types/SettingsChangeDecision.type.ts";
import { changedSettingNames } from "./changedSettingNames.function.ts";
import { dropAfterSettingsChange } from "./dropAfterSettingsChange.function.ts";
import { settingChangeRecord } from "./settingChangeRecord.function.ts";
import { settingChangeRefusal } from "./settingChangeRefusal.function.ts";
import { settingsNeedingNotice } from "./settingsNeedingNotice.function.ts";
import { settingsPicked } from "./settingsPicked.function.ts";

/**
 * Applies the freeze rules to a vendor's submitted settings. A submission with after-notice changes replaces any
 * pending notice and starts a new one; a submission without them leaves a pending notice alone.
 */
export const decideSettingsChange = (
    drop: IDrop,
    proposed: IDropSettings,
    now: EpochMilliseconds,
): SettingsChangeDecision => {
    const changed = changedSettingNames(drop.settings, proposed);
    const refusals = changed.flatMap((name) => settingChangeRefusal(drop, name, proposed) ?? []);
    if (refusals.length > 0) return { isAccepted: false, refusals };
    const noticed = settingsNeedingNotice(drop.state, changed);
    const notice = {
        givenAt: now,
        takesEffectAt: addDuration(now, settingsChangeNotice),
        changes: settingsPicked(proposed, noticed),
    };
    return {
        isAccepted: true,
        drop: dropAfterSettingsChange(drop, proposed, changed, notice),
        changes: changed.map((name) => ({
            settingName: name,
            takesEffectAt: noticed.includes(name) ? notice.takesEffectAt : now,
            record: settingChangeRecord(drop.state, name),
        })),
        isFreshSignInRequired: noticed.length > 0,
    };
};
