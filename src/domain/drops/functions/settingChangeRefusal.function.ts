import { dropSettingChangeClasses } from "../consts/dropSettingChangeClasses.const.ts";
import type { IDrop } from "../interfaces/IDrop.ts";
import type { IDropSettings } from "../interfaces/IDropSettings.ts";
import type { DropSettingName } from "../types/DropSettingName.type.ts";

/** Why a changed setting cannot take its proposed value, or null if it can. */
export const settingChangeRefusal = (drop: IDrop, name: DropSettingName, proposed: IDropSettings): string | null => {
    const changeClass = dropSettingChangeClasses[name];
    if (drop.state === "draft" || changeClass === "anytime") return null;
    if (drop.state === "finished" || drop.state === "cancelled") return `${name} cannot change once the drop has ended`;
    if (changeClass === "fixed-once-open") return `${name} is fixed once the drop opens`;
    if (name === "offerWindow" && proposed.offerWindow < drop.settings.offerWindow) {
        return "the offer window can only be made longer once the drop opens";
    }
    return null;
};
