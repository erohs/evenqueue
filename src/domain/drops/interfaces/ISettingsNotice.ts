import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";
import type { IDropSettings } from "./IDropSettings.ts";

/** A published change to after-notice settings, waiting out its notice period. A newer notice replaces it. */
export interface ISettingsNotice {
    readonly givenAt: EpochMilliseconds;
    readonly takesEffectAt: EpochMilliseconds;
    /** After-notice settings only. */
    readonly changes: Partial<IDropSettings>;
}
