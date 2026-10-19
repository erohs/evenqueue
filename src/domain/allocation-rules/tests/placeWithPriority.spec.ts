import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { deterministicBytes32Hex } from "#tests/support/functions/deterministicBytes32Hex.function.ts";
import { availableAllocationRules } from "../consts/availableAllocationRules.const.ts";
import { toPriority } from "../functions/toPriority.function.ts";
import type { AllocationRuleId } from "../types/AllocationRuleId.type.ts";

const placeId = deterministicBytes32Hex("restored");
const publishedPriorities: Readonly<Record<AllocationRuleId, readonly number[]>> = {
    "priority-after-losses": [0, 1, 2],
    "join-order-line": [0, -1, -7],
    "equal-chance-each-drop": [0],
};

describe("Using each rule's placeWithPriority, for every priority the rule publishes", () => {
    for (const [ruleId, priorities] of Object.entries(publishedPriorities) as [AllocationRuleId, number[]][]) {
        test(`then it should rebuild a place with exactly that priority under ${ruleId}`, () => {
            const rule = availableAllocationRules[ruleId];
            const rebuilt = priorities.map((priority) =>
                rule.priorityOf(rule.placeWithPriority(placeId, toPriority(priority))),
            );
            assert.deepEqual(rebuilt, priorities);
        });
    }
});
