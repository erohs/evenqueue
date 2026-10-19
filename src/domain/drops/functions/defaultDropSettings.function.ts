import type { AllocationRuleId } from "#domain/allocation-rules/types/AllocationRuleId.type.ts";
import { defaultWindowLengthsByRule } from "#domain/schedule/consts/defaultWindowLengthsByRule.const.ts";
import { toCount } from "#domain/shared/counting/functions/toCount.function.ts";
import { dropSettingLimits } from "../consts/dropSettingLimits.const.ts";
import type { IDropSettings } from "../interfaces/IDropSettings.ts";

/** A new drop's settings: the rule's windows, one unit, the largest waitlist and the shortest results retention. */
export const defaultDropSettings = (allocationRuleId: AllocationRuleId): IDropSettings => ({
    unitCount: toCount(1),
    entrantCap: toCount(dropSettingLimits.entrantCap.most),
    ...defaultWindowLengthsByRule[allocationRuleId],
    embedOrigins: [],
    pageText: "",
    announcementWebhookUrl: null,
    resultsRetentionDays: toCount(dropSettingLimits.resultsRetentionDays.least),
});
