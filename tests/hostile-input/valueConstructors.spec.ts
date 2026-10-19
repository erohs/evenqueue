import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { hostileNumbers } from "#tests/support/consts/hostileNumbers.const.ts";
import { createJoinOrderLineRule } from "#domain/allocation-rules/functions/createJoinOrderLineRule.function.ts";
import { createPriorityAfterLossesRule } from "#domain/allocation-rules/functions/createPriorityAfterLossesRule.function.ts";
import { toPriority } from "#domain/allocation-rules/functions/toPriority.function.ts";
import { toBeaconRound } from "#domain/beacon/functions/toBeaconRound.function.ts";
import { toCount } from "#domain/shared/counting/functions/toCount.function.ts";
import { durationOfHours } from "#domain/shared/time/functions/durationOfHours.function.ts";
import { toDurationMilliseconds } from "#domain/shared/time/functions/toDurationMilliseconds.function.ts";
import { toEpochMilliseconds } from "#domain/shared/time/functions/toEpochMilliseconds.function.ts";

/**
 * Every way a number can enter the engine. Engine functions take only the types these make, so refusing hostile
 * numbers here refuses them everywhere.
 */
const constructors: readonly (readonly [string, (bad: number) => unknown])[] = [
    ["toEpochMilliseconds", toEpochMilliseconds],
    ["toDurationMilliseconds", toDurationMilliseconds],
    ["toCount", toCount],
    ["toPriority", toPriority],
    ["toBeaconRound", toBeaconRound],
    ["the priority-after-losses ceiling", (bad) => createPriorityAfterLossesRule(bad)],
    ["the priority-after-losses reset", (bad) => createPriorityAfterLossesRule(2, bad)],
    ["the join-order-line allowance", (bad) => createJoinOrderLineRule(bad)],
];

for (const [name, construct] of constructors) {
    describe(`Using ${name}, when given a hostile number`, () => {
        for (const bad of hostileNumbers) {
            test(`then it should refuse ${String(bad)}`, () => {
                assert.throws(() => construct(bad), RangeError);
            });
        }
    });
}

const outOfRange: readonly (readonly [string, () => unknown])[] = [
    ["a time past the range of a Date", () => toEpochMilliseconds(8_640_000_000_000_001)],
    ["a duration of zero", () => toDurationMilliseconds(0)],
    ["a duration of more than a century", () => durationOfHours(1_000_000)],
    ["a negative count", () => toCount(-1)],
    ["a priority outside 32 signed bits", () => toPriority(2 ** 31)],
    ["beacon round zero", () => toBeaconRound(0)],
    ["a reset after zero unclaimed offers", () => createPriorityAfterLossesRule(2, 0)],
];

describe("Using the value constructors, when a whole number is outside the range its kind allows", () => {
    for (const [name, construct] of outOfRange) {
        test(`then it should refuse ${name}`, () => {
            assert.throws(construct, RangeError);
        });
    }
});
