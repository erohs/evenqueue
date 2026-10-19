import { dropSettingChangeClasses } from "../consts/dropSettingChangeClasses.const.ts";
import type { DropSettingName } from "../types/DropSettingName.type.ts";
import type { DropState } from "../types/DropState.type.ts";
import type { SettingChangeRecord } from "../types/SettingChangeRecord.type.ts";

/** A draft is not public yet, so its changes concern nobody but the vendor. */
export const settingChangeRecord = (state: DropState, name: DropSettingName): SettingChangeRecord =>
    state === "draft" || dropSettingChangeClasses[name] === "anytime" ? "private-audit" : "public-log";
