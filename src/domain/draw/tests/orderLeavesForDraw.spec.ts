import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { committedDrawForTests } from "#tests/support/functions/committedDrawForTests.function.ts";
import { publicDrawInputsFor } from "#tests/support/functions/publicDrawInputsFor.function.ts";
import { waitlistPlacesForTests } from "#tests/support/functions/waitlistPlacesForTests.function.ts";
import { availableAllocationRules } from "#domain/allocation-rules/consts/availableAllocationRules.const.ts";
import { orderLeavesForDraw } from "../functions/orderLeavesForDraw.function.ts";
import type { IRankedLeaf } from "../interfaces/IRankedLeaf.ts";

const rule = availableAllocationRules["priority-after-losses"];
const places = [...waitlistPlacesForTests("missed-out", 10, { drawsEntered: 1 }), ...waitlistPlacesForTests("new", 10)];
const { leaves } = await committedDrawForTests(rule, places, "x");
const idsInOrder = (order: readonly IRankedLeaf[]): string[] => order.map((leaf) => leaf.publicDrawId);

describe("Using orderLeavesForDraw, when the same leaves are listed in reverse", () => {
    test("then it should produce the same order", async () => {
        const forward = await orderLeavesForDraw(leaves, publicDrawInputsFor("x"));
        const reversed = await orderLeavesForDraw(leaves.toReversed(), publicDrawInputsFor("x"));
        assert.deepEqual(idsInOrder(reversed), idsInOrder(forward));
    });
});

describe("Using orderLeavesForDraw, when the beacon randomness differs", () => {
    test("then it should produce a different order", async () => {
        const first = await orderLeavesForDraw(leaves, publicDrawInputsFor("x"));
        const second = await orderLeavesForDraw(leaves, publicDrawInputsFor("y"));
        assert.notDeepEqual(idsInOrder(second), idsInOrder(first));
    });
});

describe("Using orderLeavesForDraw, when leaves hold different priorities", () => {
    test("then it should put every higher priority first", async () => {
        const priorities = (await orderLeavesForDraw(leaves, publicDrawInputsFor("x"))).map((leaf) => leaf.priority);
        assert.deepEqual(
            priorities,
            priorities.toSorted((first, second) => second - first),
        );
    });
});
