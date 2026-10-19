import type { AllocationRuleId } from "#domain/allocation-rules/types/AllocationRuleId.type.ts";

/** Plain words for buyers. Never the gambling words kept off buyer pages. */
export const allocationRuleExplanations: Readonly<Record<AllocationRuleId, string>> = {
    "priority-after-losses":
        "When units go on sale, places are offered in a random order, fixed in public before anyone can know it. " +
        "If you miss out, your place moves up for next time, by up to two steps.",
    "equal-chance-each-drop":
        "When units go on sale, places are offered in a random order, fixed in public before anyone can know it. " +
        "Every place has the same chance every time.",
    "join-order-line":
        "Places are offered in the order of the joining period they joined in. " +
        "Within one period the order is random, fixed in public before anyone can know it.",
};
