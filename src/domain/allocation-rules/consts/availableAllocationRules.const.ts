import { createEqualChanceEachDropRule } from "../functions/createEqualChanceEachDropRule.function.ts";
import { createJoinOrderLineRule } from "../functions/createJoinOrderLineRule.function.ts";
import { createPriorityAfterLossesRule } from "../functions/createPriorityAfterLossesRule.function.ts";
import type { IAllocationRule } from "../interfaces/IAllocationRule.ts";
import type { AllocationRuleId } from "../types/AllocationRuleId.type.ts";

/** The rules a vendor can choose per drop, with their default settings. */
export const availableAllocationRules: Readonly<Record<AllocationRuleId, IAllocationRule>> = {
    "equal-chance-each-drop": createEqualChanceEachDropRule(),
    "priority-after-losses": createPriorityAfterLossesRule(2),
    "join-order-line": createJoinOrderLineRule(2),
};
