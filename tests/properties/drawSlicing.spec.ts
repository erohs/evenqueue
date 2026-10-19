import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { committedDrawForTests } from "#tests/support/functions/committedDrawForTests.function.ts";
import { createSeededRandom } from "#tests/support/functions/createSeededRandom.function.ts";
import { randomWholeNumber } from "#tests/support/functions/randomWholeNumber.function.ts";
import { waitlistPlacesForTests } from "#tests/support/functions/waitlistPlacesForTests.function.ts";
import { availableAllocationRules } from "#domain/allocation-rules/consts/availableAllocationRules.const.ts";
import { addSliceToDraw } from "#domain/draw/functions/addSliceToDraw.function.ts";
import { orderLeavesForDraw } from "#domain/draw/functions/orderLeavesForDraw.function.ts";
import { startDrawInSlices } from "#domain/draw/functions/startDrawInSlices.function.ts";
import type { IDrawInProgress } from "#domain/draw/interfaces/IDrawInProgress.ts";
import { toCount } from "#domain/shared/counting/functions/toCount.function.ts";

const random = createSeededRandom(6);
const places = waitlistPlacesForTests("slicing", 120).map((place) => ({
    ...place,
    drawsEntered: toCount(randomWholeNumber(random, 0, 3)),
}));
const committed = await committedDrawForTests(availableAllocationRules["priority-after-losses"], places, "slicing");
const ids = (leaves: IDrawInProgress["bestSoFar"]): string[] => leaves.map((leaf) => leaf.publicDrawId);

const runInSlices = async (sliceSize: number, placesToKeep: number, shouldRepeatSlices: boolean) => {
    let draw = startDrawInSlices(toCount(placesToKeep));
    for (let slice = 0; slice * sliceSize < committed.leaves.length; slice++) {
        const leaves = committed.leaves.slice(slice * sliceSize, (slice + 1) * sliceSize);
        draw = await addSliceToDraw(draw, toCount(slice), leaves, committed.publicDrawInputs);
        if (shouldRepeatSlices) draw = await addSliceToDraw(draw, toCount(slice), leaves, committed.publicDrawInputs);
    }
    return draw.bestSoFar;
};

describe("Using addSliceToDraw, for random slice sizes", () => {
    test("then the result should equal the top of a full draw, even when every slice runs twice after a crash", async () => {
        const full = ids(await orderLeavesForDraw(committed.leaves, committed.publicDrawInputs));
        for (let trial = 0; trial < 12; trial++) {
            const sliceSize = randomWholeNumber(random, 1, 50);
            const placesToKeep = randomWholeNumber(random, 0, 60);
            assert.deepEqual(
                ids(await runInSlices(sliceSize, placesToKeep, trial % 2 === 0)),
                full.slice(0, placesToKeep),
            );
        }
    });
});
