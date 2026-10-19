import { availableAllocationRules } from "../consts/availableAllocationRules.const.ts";
import type { AllocationRuleId } from "../types/AllocationRuleId.type.ts";

export const isAllocationRuleId = (value: unknown): value is AllocationRuleId =>
    typeof value === "string" && Object.hasOwn(availableAllocationRules, value);
