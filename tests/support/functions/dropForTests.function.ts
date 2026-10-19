import { defaultDropSettings } from "#domain/drops/functions/defaultDropSettings.function.ts";
import type { IDrop } from "#domain/drops/interfaces/IDrop.ts";
import type { DropState } from "#domain/drops/types/DropState.type.ts";
import { toCount } from "#domain/shared/counting/functions/toCount.function.ts";
import { toEpochMilliseconds } from "#domain/shared/time/functions/toEpochMilliseconds.function.ts";
import { deterministicBytes32Hex } from "./deterministicBytes32Hex.function.ts";

/** A drop under priority-after-losses with default settings, opened at a fixed time unless it is a draft. */
export const dropForTests = (state: DropState): IDrop => ({
    dropId: deterministicBytes32Hex("drop"),
    waitlistId: deterministicBytes32Hex("waitlist"),
    entryWindowNumber: toCount(3),
    state,
    settings: defaultDropSettings("priority-after-losses"),
    openedAt: state === "draft" ? null : toEpochMilliseconds(1_760_000_000_000),
    settingsNotice: null,
});
