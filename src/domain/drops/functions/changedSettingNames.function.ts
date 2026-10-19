import { canonicalJson } from "#domain/public-log/functions/canonicalJson.function.ts";
import { dropSettingChangeClasses } from "../consts/dropSettingChangeClasses.const.ts";
import type { IDropSettings } from "../interfaces/IDropSettings.ts";
import type { DropSettingName } from "../types/DropSettingName.type.ts";

const everySettingName = Object.keys(dropSettingChangeClasses) as DropSettingName[];

/** Compared as canonical JSON, so lists and nulls compare by value. */
export const changedSettingNames = (current: IDropSettings, proposed: IDropSettings): DropSettingName[] =>
    everySettingName.filter((name) => canonicalJson(current[name]) !== canonicalJson(proposed[name]));
