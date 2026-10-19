import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { entrantInDraw } from "#tests/support/functions/entrantInDraw.function.ts";
import { publicDrawInputsFor } from "#tests/support/functions/publicDrawInputsFor.function.ts";
import { waitlistPlacesForTests } from "#tests/support/functions/waitlistPlacesForTests.function.ts";
import { availableAllocationRules } from "#domain/allocation-rules/consts/availableAllocationRules.const.ts";
import type { IAllocationRule } from "#domain/allocation-rules/interfaces/IAllocationRule.ts";
import { orderEntrantsForDraw } from "../functions/orderEntrantsForDraw.function.ts";
import type { IRankedEntrant } from "../interfaces/IRankedEntrant.ts";

const rule = availableAllocationRules["priority-after-losses"];
const entrants = waitlistPlacesForTests("entrant", 20, { drawsEntered: 1 }).map((place) => entrantInDraw(place, "x"));
const publicIdsInOrder = (order: readonly IRankedEntrant[]): string[] => order.map((ranked) => ranked.publicDrawId);

describe("Using orderEntrantsForDraw, when the same entrants are listed in reverse", () => {
    test("then it should produce the same order", async () => {
        const forward = await orderEntrantsForDraw(rule, entrants, publicDrawInputsFor("x"));
        const reversed = await orderEntrantsForDraw(rule, entrants.toReversed(), publicDrawInputsFor("x"));
        assert.deepEqual(publicIdsInOrder(reversed), publicIdsInOrder(forward));
    });
});

describe("Using orderEntrantsForDraw, when the beacon randomness differs", () => {
    test("then it should produce a different order", async () => {
        const first = await orderEntrantsForDraw(rule, entrants, publicDrawInputsFor("x"));
        const second = await orderEntrantsForDraw(rule, entrants, publicDrawInputsFor("y"));
        assert.notDeepEqual(publicIdsInOrder(second), publicIdsInOrder(first));
    });
});

describe("Using orderEntrantsForDraw, when a rule returns a fractional priority", () => {
    test("then it should refuse to order the draw", async () => {
        const brokenRule: IAllocationRule = { ...rule, priorityOf: () => 0.5 };
        await assert.rejects(orderEntrantsForDraw(brokenRule, entrants, publicDrawInputsFor("x")), RangeError);
    });
});
