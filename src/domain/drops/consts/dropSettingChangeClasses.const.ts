import type { DropSettingName } from "../types/DropSettingName.type.ts";
import type { SettingChangeClass } from "../types/SettingChangeClass.type.ts";

/** Every setting has a class, so adding a setting without deciding how it may change does not compile. */
export const dropSettingChangeClasses: Readonly<Record<DropSettingName, SettingChangeClass>> = {
    unitCount: "unit-count",
    entrantCap: "fixed-once-open",
    entryWindow: "fixed-once-open",
    offerWindow: "after-notice",
    checkpointInterval: "after-notice",
    embedOrigins: "after-notice",
    pageText: "anytime",
    announcementWebhookUrl: "anytime",
    resultsRetentionDays: "anytime",
};
