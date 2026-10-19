import { defaultDropSettings } from "#domain/drops/functions/defaultDropSettings.function.ts";
import type { IDrop } from "#domain/drops/interfaces/IDrop.ts";
import { toCount } from "#domain/shared/counting/functions/toCount.function.ts";
import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";
import { developmentWaitlist } from "../consts/developmentWaitlist.const.ts";
import { developmentId } from "./developmentId.function.ts";

/** The demo drop, open from `openedAt` with the rule's default windows. */
export const developmentDrop = (openedAt: EpochMilliseconds): IDrop => ({
    dropId: developmentId("development drop"),
    waitlistId: developmentWaitlist.waitlistId,
    entryWindowNumber: toCount(0),
    state: "open",
    settings: {
        ...defaultDropSettings(developmentWaitlist.allocationRuleId),
        pageText: "Hand-saved seeds, small batches.\n\nOne packet per place.",
    },
    openedAt,
    settingsNotice: null,
});
