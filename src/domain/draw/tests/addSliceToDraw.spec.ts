import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { committedDrawForTests } from "#tests/support/functions/committedDrawForTests.function.ts";
import { deterministicBytes32Hex } from "#tests/support/functions/deterministicBytes32Hex.function.ts";
import { availableAllocationRules } from "#domain/allocation-rules/consts/availableAllocationRules.const.ts";
import { toCount } from "#domain/shared/counting/functions/toCount.function.ts";
import { createWaitlistPlace } from "#domain/waitlist/functions/createWaitlistPlace.function.ts";
import type { IWaitlistLeaf } from "#domain/commitment/interfaces/IWaitlistLeaf.ts";
import { addSliceToDraw } from "../functions/addSliceToDraw.function.ts";
import { orderLeavesForDraw } from "../functions/orderLeavesForDraw.function.ts";
import { startDrawInSlices } from "../functions/startDrawInSlices.function.ts";
import type { IDrawInProgress } from "../interfaces/IDrawInProgress.ts";

const placesToKeep = toCount(12);
const sliceSizes = [1, 7, 33, 60];
const mixedPlaces = Array.from({ length: 60 }, (_, i) => ({
    ...createWaitlistPlace(deterministicBytes32Hex(`place-${i}`), toCount(i % 3)),
    drawsEntered: toCount(i % 4),
}));
const ids = (draw: IDrawInProgress): string[] => draw.bestSoFar.map((leaf) => leaf.publicDrawId);

const drawInSlices = async (
    leaves: readonly IWaitlistLeaf[],
    sliceSize: number,
    inputs: Parameters<typeof orderLeavesForDraw>[1],
) => {
    let draw = startDrawInSlices(placesToKeep);
    for (let start = 0; start * sliceSize < leaves.length; start++) {
        draw = await addSliceToDraw(
            draw,
            toCount(start),
            leaves.slice(start * sliceSize, (start + 1) * sliceSize),
            inputs,
        );
    }
    return draw;
};

for (const rule of Object.values(availableAllocationRules)) {
    describe(`Using addSliceToDraw under the ${rule.id} rule, when a draw runs in slices`, async () => {
        const committed = await committedDrawForTests(rule, mixedPlaces, "sliced");
        const fullDraw = (await orderLeavesForDraw(committed.leaves, committed.publicDrawInputs)).slice(
            0,
            placesToKeep,
        );
        for (const sliceSize of sliceSizes) {
            test(`then it should match a full draw with slices of ${sliceSize}`, async () => {
                const sliced = await drawInSlices(committed.leaves, sliceSize, committed.publicDrawInputs);
                assert.deepEqual(
                    ids(sliced),
                    fullDraw.map((leaf) => leaf.publicDrawId),
                );
            });
        }
    });
}

describe("Using addSliceToDraw, when a slice already added is sent again after a crash", () => {
    test("then it should change nothing", async () => {
        const committed = await committedDrawForTests(
            availableAllocationRules["priority-after-losses"],
            mixedPlaces,
            "replay",
        );
        const once = await addSliceToDraw(
            startDrawInSlices(placesToKeep),
            toCount(0),
            committed.leaves.slice(0, 10),
            committed.publicDrawInputs,
        );
        assert.equal(
            await addSliceToDraw(once, toCount(0), committed.leaves.slice(0, 10), committed.publicDrawInputs),
            once,
        );
    });
});

describe("Using addSliceToDraw, when a slice is skipped", () => {
    test("then it should refuse the later slice", async () => {
        const committed = await committedDrawForTests(
            availableAllocationRules["priority-after-losses"],
            mixedPlaces,
            "skip",
        );
        const skipped = addSliceToDraw(
            startDrawInSlices(placesToKeep),
            toCount(1),
            committed.leaves.slice(10, 20),
            committed.publicDrawInputs,
        );
        await assert.rejects(skipped, RangeError);
    });
});
