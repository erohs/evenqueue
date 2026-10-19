import type { IDropSettings } from "../interfaces/IDropSettings.ts";
import type { DropSettingName } from "../types/DropSettingName.type.ts";

export const settingsPicked = (settings: IDropSettings, names: readonly DropSettingName[]): Partial<IDropSettings> =>
    Object.fromEntries(names.map((name) => [name, settings[name]]));
