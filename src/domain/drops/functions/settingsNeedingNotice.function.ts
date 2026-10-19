import { dropSettingChangeClasses } from "../consts/dropSettingChangeClasses.const.ts";
import type { DropSettingName } from "../types/DropSettingName.type.ts";
import type { DropState } from "../types/DropState.type.ts";

export const settingsNeedingNotice = (state: DropState, changed: readonly DropSettingName[]): DropSettingName[] =>
    state === "draft" ? [] : changed.filter((name) => dropSettingChangeClasses[name] === "after-notice");
