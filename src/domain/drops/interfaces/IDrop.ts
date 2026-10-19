import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";
import type { DropState } from "../types/DropState.type.ts";
import type { IDropSettings } from "./IDropSettings.ts";
import type { ISettingsNotice } from "./ISettingsNotice.ts";

/** One release of units to a waitlist's places. */
export interface IDrop {
    readonly dropId: Bytes32Hex;
    readonly waitlistId: Bytes32Hex;
    readonly state: DropState;
    readonly settings: IDropSettings;
    /** Null until the drop opens. The entry window's uptime counts from here. */
    readonly openedAt: EpochMilliseconds | null;
    readonly settingsNotice: ISettingsNotice | null;
}
