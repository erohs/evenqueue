import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";
import type { IDrop } from "../interfaces/IDrop.ts";

/** Applies a notice whose period has run out. */
export const settingsInForceAt = (drop: IDrop, now: EpochMilliseconds): IDrop => {
    const notice = drop.settingsNotice;
    if (notice === null || now < notice.takesEffectAt) return drop;
    return { ...drop, settings: { ...drop.settings, ...notice.changes }, settingsNotice: null };
};
