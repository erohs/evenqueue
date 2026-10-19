import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { createSeededRandom } from "#tests/support/functions/createSeededRandom.function.ts";
import { deterministicBytes32Hex } from "#tests/support/functions/deterministicBytes32Hex.function.ts";
import { availableAllocationRules } from "#domain/allocation-rules/consts/availableAllocationRules.const.ts";
import type { IAllocationRule } from "#domain/allocation-rules/interfaces/IAllocationRule.ts";
import type { PlaceOutcomeInDrop } from "#domain/allocation-rules/types/PlaceOutcomeInDrop.type.ts";
import { toCount } from "#domain/shared/counting/functions/toCount.function.ts";
import { createWaitlistPlace } from "#domain/waitlist/functions/createWaitlistPlace.function.ts";
import { parseWaitlistPlace } from "#domain/waitlist/functions/parseWaitlistPlace.function.ts";
import type { IWaitlistPlace } from "#domain/waitlist/interfaces/IWaitlistPlace.ts";

const random = createSeededRandom(7);
const outcomes: readonly Exclude<PlaceOutcomeInDrop, "bought">[] = [
    "not-offered",
    "offer-not-taken",
    "offer-withdrawn",
];

/** One place through 200 random drops: its priority after each, and whether it always stayed a valid place. */
const journey = (rule: IAllocationRule): { priorities: number[]; isAlwaysValid: boolean } => {
    let place: IWaitlistPlace | null = createWaitlistPlace(deterministicBytes32Hex("journey"), toCount(0));
    const priorities: number[] = [];
    let isAlwaysValid = true;
    for (let drop = 1; drop <= 200 && place !== null; drop++) {
        isAlwaysValid &&= parseWaitlistPlace(place).isValid;
        priorities.push(rule.priorityOf(place));
        place = rule.placeAfterDrop(
            place,
            outcomes[Math.floor(random() * outcomes.length)] ?? "not-offered",
            toCount(drop),
        );
    }
    return { priorities, isAlwaysValid };
};
const journeys = Object.values(availableAllocationRules).flatMap((rule) =>
    Array.from({ length: 50 }, () => ({ rule, ...journey(rule) })),
);

describe("Using every allocation rule, for 50 random journeys of 200 drops each", () => {
    test("then every place along the way should read back as a valid stored place", () => {
        assert.ok(journeys.every((each) => each.isAlwaysValid));
    });

    test("then no priority should be negative zero", () => {
        assert.ok(journeys.every((each) => each.priorities.every((priority) => !Object.is(priority, -0))));
    });

    test("then priority-after-losses should stay between zero and its ceiling of two", () => {
        const ruleJourneys = journeys.filter((each) => each.rule.id === "priority-after-losses");
        assert.ok(ruleJourneys.every((each) => each.priorities.every((priority) => priority >= 0 && priority <= 2)));
    });
});

describe("Using every allocation rule, when the vendor withdraws an offer", () => {
    for (const rule of Object.values(availableAllocationRules)) {
        test(`then ${rule.id} should treat the place exactly as if it had not been offered`, () => {
            const place = {
                ...createWaitlistPlace(deterministicBytes32Hex("withdrawn"), toCount(1)),
                drawsEntered: toCount(1),
            };
            assert.deepEqual(
                rule.placeAfterDrop(place, "offer-withdrawn", toCount(5)),
                rule.placeAfterDrop(place, "not-offered", toCount(5)),
            );
        });
    }
});
