import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { availableAllocationRules } from "#domain/allocation-rules/consts/availableAllocationRules.const.ts";
import type { AllocationRuleId } from "#domain/allocation-rules/types/AllocationRuleId.type.ts";
import { defaultDropSettings } from "../functions/defaultDropSettings.function.ts";
import { parseDropSettings } from "../functions/parseDropSettings.function.ts";

describe("Using defaultDropSettings, for every allocation rule", () => {
    test("then it should give settings that pass the vendor's own checks", () => {
        for (const ruleId of Object.keys(availableAllocationRules) as AllocationRuleId[]) {
            assert.deepEqual(parseDropSettings(defaultDropSettings(ruleId)), {
                isValid: true,
                value: defaultDropSettings(ruleId),
            });
        }
    });
});

describe("Using defaultDropSettings, for the join-order line", () => {
    test("then it should use the line's shorter windows", () => {
        assert.equal(defaultDropSettings("join-order-line").entryWindow, 36 * 3_600_000);
    });
});
