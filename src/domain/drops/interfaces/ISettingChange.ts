import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";
import type { DropSettingName } from "../types/DropSettingName.type.ts";
import type { SettingChangeRecord } from "../types/SettingChangeRecord.type.ts";

export interface ISettingChange {
    readonly settingName: DropSettingName;
    readonly takesEffectAt: EpochMilliseconds;
    readonly record: SettingChangeRecord;
}
